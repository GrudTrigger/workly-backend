package auth

import (
	"context"
	"database/sql"

	_ "github.com/lib/pq"
)

type Repository interface {
	Close()
	PostAccount(ctx context.Context, a *Account) error
	GetAccountByEmail(ctx context.Context, email string) (*Account, error)
	GetAccountById(ctx context.Context, id string) (*Account, error)
}

type accountRepository struct {
	db *sql.DB
}

func NewAccountRepository(dsn string)(Repository, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return &accountRepository{db}, nil
}

func (r *accountRepository) Close() {
	r.db.Close()
}

// Создание аккаунта
func(r *accountRepository) PostAccount(ctx context.Context, a *Account) error {
	_, err := r.db.ExecContext(
		ctx, "INSERT INTO account(id, email, password, role) VALUES($1, $2, $3, $4)",
		a.ID, a.Email, a.Password, a.Role)
	return err	
}

// Получение аккаунта
func(r *accountRepository) GetAccountByEmail(ctx context.Context, email string) (*Account, error) {
	row := r.db.QueryRowContext(ctx, "SELECT id, email, password, role FROM account WHERE email = $1", email)

	a := &Account{}

	if err := row.Scan(&a.ID, &a.Email, &a.Password, &a.Role); err != nil {
		return nil, err
	}

	return a, nil
}

func(r *accountRepository) GetAccountById(ctx context.Context, id string) (*Account, error) {
	row := r.db.QueryRowContext(ctx, "SELECT id, email, password, role FROM account WHERE id = $1", id)

	a :=  &Account{}

	if err := row.Scan(&a.ID, &a.Email, &a.Password, &a.Role); err != nil {
		return nil, err
	}
	return a, nil
}