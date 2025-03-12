package handlers

import (
	"encoding/json"
	"fmt"
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
		fmt.Println(token)
	}
}
