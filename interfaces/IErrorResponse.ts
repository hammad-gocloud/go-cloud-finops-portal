
export interface IErrorResponse extends Error {
  response?: {
    status: number;
    data: {
      errors: Record<string, string>;
      message: string;
      statusCode: number;
    };
  };
  config?: any;
  request?: any;
}
