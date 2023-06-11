type Result<T> = Promise<{ data: T }>;

type Paginated<T> = { items: T; count: number };

interface Request extends Express.Request {
  state: { user?: User };
}
