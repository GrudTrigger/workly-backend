package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Secret string
	Dsn string
}

func LoadConfig() *Config {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Ошбика загрузки env файла в auth service")
		log.Println(err)
	}
	return &Config{
		Secret: os.Getenv("SECRET"),
		Dsn: os.Getenv("DSN"),
	}
}