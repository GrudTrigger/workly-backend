package auth

import (
	"context"

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

func NewAccountService(r Repository) Service {
	return &accountService{r}
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

