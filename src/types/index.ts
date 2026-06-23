export interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: Date;
  endsAt: Date | null;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  filter: "all" | "active" | "inactive";
  sortBy: "createdAt" | "name" | "products" | "startsAt";
  sortOrder: "asc" | "desc";
}
