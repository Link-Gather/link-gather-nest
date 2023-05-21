type Result<T> = Promise<{ data: { data: T; count?: number } }>;

type Paginated<T> = { data: T; count: number };

interface Request extends Express.Request {
  state: { user?: User };
}
