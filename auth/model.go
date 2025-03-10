package auth

type Account struct {
	ID string `json:"id"`
	Email string `json:"email"`
	Password string `json:"password"`
	Role uint32 `json:"role"`
}

type AccountResponse struct {
	Email string `json:"email"`
	Password string `json:"password"`
	Role uint32 `json:"role"`
}