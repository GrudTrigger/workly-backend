package auth

import (
	"context"
	"net/http"

	"github.com/GrudTrigger/workly-backend/auth/pkg/helpers"
	"github.com/GrudTrigger/workly-backend/auth/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Register(ctx context.Context, a AccountResponse) (*jwt.JWTData, error)
	Login(ctx context.Context, email, password string) (*jwt.JWTData, error)
}

type accountService struct {
	repository Repository
}

func NewAccountService() Service {
	return &accountService{}
}

func(s *accountService) Register(ctx context.Context, acc AccountResponse) (*jwt.JWTData, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(acc.Password), bcrypt.DefaultCost)
	if err != nil {
		return &jwt.JWTData{}, err
	}

	a := &Account{
		ID: helpers.GenerateUUID(),
		Email: acc.Email,
		Password: string(hashedPassword),
		Role: acc.Role,
	}
	if err := s.repository.PostAccount(ctx, a); err != nil {
		return nil, err
	}
	token, err := jwt.NewJWT(handler.config.Secret).Create(jwt.JWTData{UserID: jwtData.UserID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jwtData := jwt.JWTData{
		UserID: a.ID,
	}

	return &jwtData, nil
}

func(s *accountService) Login(ctx context.Context, email, password string) (*jwt.JWTData, error) {
	existedUser, err := s.repository.GetAccountByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(existedUser.Password), []byte(password))
	if err != nil {
		return &jwt.JWTData{}, nil	
	}

	jwtData := jwt.JWTData{
		UserID: existedUser.ID,
	}

	return &jwtData, nil
}

