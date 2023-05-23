type Result<T> = Promise<{ data: T }>;

type Paginated<T> = { data: T; count: number };

interface Request extends Express.Request {
  state: { user?: User };
}
