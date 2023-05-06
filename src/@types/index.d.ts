type Result<T> = Promise<{ data: T; count?: number }>;

interface Request extends Express.Request {
  state: { user?: User };
}
