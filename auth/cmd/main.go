package main

import (
	"log"

	"github.com/GrudTrigger/workly-backend/auth"
	"github.com/GrudTrigger/workly-backend/auth/config"
)

func main() {
	conf := config.LoadConfig()
	repo, err := auth.NewAccountRepository(conf.Dsn)
	if err != nil {
		log.Println("Ошибка подключения к бд в auth service")
		panic(err)
	}
	defer repo.Close()
	service := auth.NewAccountService(repo, conf.Secret)

	log.Println("Запущен auth-микросервис на порту 8081")
	log.Fatal(auth.ListenGRPC(service, 8081))
}