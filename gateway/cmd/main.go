package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/GrudTrigger/workly-backend/auth"
	"github.com/GrudTrigger/workly-backend/gateway/handlers"
	"github.com/GrudTrigger/workly-backend/gateway/pkg/middleware"
)
var secret = "3KX9v7z5w8y$B&E)H@McQfTjWnZr4u7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+MbQ"

func main() {
	router := http.NewServeMux()
	authClient, err := auth.NewClient("localhost:8081")
	if err != nil {
		fmt.Println("auth-service-start", err)
	}
	
	handlers.NewAuthHandler(router, authClient, secret)

	stack := middleware.Chain(
		middleware.Logging,
	)

	server := http.Server{
		Addr: ":8080",
		Handler: stack(router),
	}
	log.Println("API GATEWAY работает на :8080")
	log.Fatal(server.ListenAndServe())
}


// Прокси сервер, нужен ли будет?
// http.HandleFunc("/auth/", reverseProxy("http://localhost:8081"))
// func reverseProxy(target string) http.HandlerFunc{
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		url, err := url.Parse(target)
// 		if err != nil {
// 			http.Error(w, "Ошибка при разборе URL", http.StatusInternalServerError)
// 			return
// 		}
// 		proxy := httputil.NewSingleHostReverseProxy(url)
// 		proxy.ServeHTTP(w, r)
// 	}
// }