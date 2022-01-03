
export interface ErrorCode {
    key: number;
    description: string;
  }
  export class ErrorCodes {
    public static readonly ER_1: ErrorCode = { key: 1, description: "this period exists" };
  }
  export class Error {
    constructor(public errorCode: ErrorCode) {}
    static make(errorCode: ErrorCode) {
      return new Error(errorCode);
    }
  }