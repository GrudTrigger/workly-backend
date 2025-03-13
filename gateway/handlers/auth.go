package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/GrudTrigger/workly-backend/auth"
)

type AuthHandlers struct {
	grpcClient *auth.Client
}

func NewAuthHandler(router *http.ServeMux,client *auth.Client){
	handler := &AuthHandlers{
		grpcClient: client,
	}

	router.HandleFunc("POST /auth/login", handler.Login())
	router.HandleFunc("POST /auth/register", handler.Register())
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
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(token)
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
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(token)
	}
}
