interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare namespace Express {
  export interface Request {
    newTokens?: Tokens;
  }
}
