
class PageBladeError extends Error {

  public code: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.code = statusCode;
  }
}

export { PageBladeError };
