package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/GrudTrigger/workly-backend/auth"
	"github.com/GrudTrigger/workly-backend/auth/pkg/jwt"
	"github.com/GrudTrigger/workly-backend/gateway/pkg/middleware"
	"github.com/GrudTrigger/workly-backend/gateway/pkg/response"
)

type AuthHandlers struct {
	grpcClient *auth.Client
}

func NewAuthHandler(router *http.ServeMux,client *auth.Client, secret string){
	handler := &AuthHandlers{
		grpcClient: client,
	}

	router.HandleFunc("POST /auth/login", handler.Login())
	router.HandleFunc("POST /auth/register", handler.Register())
	router.Handle("GET /auth/me", middleware.IsAuthed(handler.GetMe(), secret))
}

func(handler *AuthHandlers) Register() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Неверный формат запроса", http.StatusBadRequest)
			return
		}
		token, err := handler.grpcClient.Register(ctx, req.Email, req.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		response.ResponseJson(w, token, 200)
	}
}

func(handler *AuthHandlers) Login() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				http.Error(w, "Неверный формат запроса", http.StatusBadRequest)
				return
		}
		token, err := handler.grpcClient.Login(ctx,req.Email,req.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		response.ResponseJson(w, token, 200)
	}
}

func(handler *AuthHandlers) GetMe() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		userData, ok := ctx.Value(middleware.UserContextKey).(*jwt.JWTData)
		if !ok || userData == nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		account, err := handler.grpcClient.GetMe(ctx, userData.UserID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		response.ResponseJson(w, account, 200)
	}
}