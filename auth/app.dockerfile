# Используем официальный образ Go для сборки приложения
FROM golang:1.23.5 AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем go.mod и go.sum для установки зависимостей
COPY go.mod go.sum ./

# Загружаем зависимости
RUN go mod download

# Копируем остальные файлы проекта
COPY auth auth

# Собираем бинарный файл
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /go/bin/app ./auth/cmd/

# Используем минимальный образ для финального контейнера
FROM alpine:latest

# Устанавливаем рабочую директорию
WORKDIR /usr/bin

# Копируем бинарный файл из предыдущего этапа
COPY --from=builder /go/bin .

# Открываем порт, если требуется (замените на нужный)
EXPOSE 8081

# Запускаем приложение
CMD ["app"]
