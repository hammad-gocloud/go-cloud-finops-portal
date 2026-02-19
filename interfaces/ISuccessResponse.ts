export interface ISuccessResponse<T = unknown> {
  message?: string;
  data?: T;
  [key: string]: unknown; // allows other unpredictable fields
}
