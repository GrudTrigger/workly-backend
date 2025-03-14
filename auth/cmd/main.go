package main

import (
	"log"

	"github.com/GrudTrigger/workly-backend/auth"
)

type Config struct {
	Secret string `envconfig:"SECRET"`
	Dsn string `envconfig:"DSN"`
}

func main() {
	// conf := config.LoadConfig()
	var cfg = Config{
		Dsn: "postgres://postgres:12345@auth_db:5432/workly?sslmode=disable",
		Secret: "3KX9v7z5w8y$B&E)H@McQfTjWnZr4u7x!A%D*G-JaNdRgUkXp2s5v8y/B?E(H+MbQ",
	}
	// err := envconfig.Process("", &cfg)
	// if err != nil {
  //   fmt.Println("Ошибка загрузки envconfig:", err)
  //   panic(err)
	// }
	repo, err := auth.NewAccountRepository(cfg.Dsn)
	if err != nil {
		log.Println("Ошибка подключения к бд в auth service")
		panic(err)
	}
	defer repo.Close()
	service := auth.NewAccountService(repo, cfg.Secret)

	log.Println("Запущен auth-микросервис на порту 8081")
	log.Fatal(auth.ListenGRPC(service, 8081))
}