export interface FindOptions {
  filter?: any;
  sort?: Record<string, 'asc' | 'desc'>;
  skip?: number;
  limit?: number;
}
