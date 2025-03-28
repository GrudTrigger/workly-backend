export interface RequestWithUser extends Request {
  user: TokenUser;
}

export interface TokenUser {
  id: number;
}
