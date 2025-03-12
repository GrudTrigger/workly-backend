package main

import (
	"log"

	"github.com/GrudTrigger/workly-backend/auth"
)

func main() {
	// repo := auth.NewAccountRepository()
	// defer repo.Close()
	service := auth.NewAccountService()

	log.Println("Запущен auth-микросервис на порту 8081")
	log.Fatal(auth.ListenGRPC(service, 8081))
}