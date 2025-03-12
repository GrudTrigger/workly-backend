package auth

import (
	"context"

	"github.com/GrudTrigger/workly-backend/auth/pb"
	"google.golang.org/grpc"
)

type Client struct {
	conn *grpc.ClientConn
	service pb.AuthServiceClient
}

func NewClient(url string) (*Client, error) {
	// conn, err := grpc.NewClient(url)
	// if err != nil {
	// 	return nil, err
	// }
	// c := pb.NewAuthServiceClient(conn)
	// return &Client{conn, c}, nil
	conn, err := grpc.Dial(url, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}
	c := pb.NewAuthServiceClient(conn)
	return &Client{conn, c}, nil
}

func(c *Client) Close() {
	c.conn.Close()
}

func(c *Client) Register(ctx context.Context, email, password string) (string, error) {
	result, err := c.service.Register(ctx, &pb.RegisterRequest{
		Email: email,
		Password: password,
		Role: "user",
	})
	if err != nil {
		return "", err
	}
	return result.Token, nil
}

func(c *Client) Login(ctx context.Context ,email, password string) (string, error) {
	result, err := c.service.Login(ctx, &pb.LoginRequest{
		Email: email,
		Password: password,
	})
	if err != nil {
		return "", err
	}
	return result.Token, nil
}