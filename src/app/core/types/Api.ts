export type ApiResponse<T> = {
  status: string;
  message: string | null;
  data: T;
  metadata: PaginationMetadata | null;
  errors: ValidationError[] | null;
};

export type ValidationError = {
  field: string;
  message: string;
};

export type PaginationMetadata = {
  page: number;
  offset: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
