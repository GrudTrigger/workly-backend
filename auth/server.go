package auth

import (
	"fmt"
	"net"

	"github.com/GrudTrigger/workly-backend/auth/pb"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type grpcServer struct {
	service Service
	pb.UnimplementedAuthServiceServer
}

func ListenGRPC(s Service, port int) error {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return err
	}
	serv := grpc.NewServer()
	pb.RegisterAuthServiceServer(serv, &grpcServer{
		service:s,
		UnimplementedAuthServiceServer: pb.UnimplementedAuthServiceServer{},
	})
	reflection.Register(serv)
	return serv.Serve(lis)
}

func(s *grpcServer) Register(ctx context.Context, r *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	result, err := s.service.Register(ctx, AccountResponse{
		Email: r.Email,
		Password: r.Password,
		Role: r.Role,
	})
	if err != nil {
		return &pb.RegisterResponse{}, err
	}
	return &pb.RegisterResponse{
		Token: result.Token,
	}
} 

func(s *grpcServer) Login(ctx context.Context, r *pb.LoginRequest) (*pb.LoginResponse, error) {
	fmt.Println("request server auth", r)
	return &pb.LoginResponse{
		Token: "jnbhrgbtui34y598",
	}, nil
} 