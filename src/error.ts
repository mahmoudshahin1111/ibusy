
export interface ErrorCode {
    key: number;
    description: string;
  }
  export class ErrorCodes {
    public static readonly ER_PERIOD_START_DATE_AFTER_END_DATE: ErrorCode = { key: 1, description: "period start time greater than the end time" };
    public static readonly ER_INVALID_PERIOD: ErrorCode = { key: 2, description: "invalid period the period format should be on this format YYYY-MM-DDTHH:mm:ss.sssZ" };
    public static readonly ER_EXISTS_INTO_ALLOW_PERIODS: ErrorCode = { key: 3, description: "the date exists into allowed periods" };
    public static readonly ER_EXISTS_INTO_Disallowed_PERIODS: ErrorCode = { key: 4, description: "the date exists into disallowed periods" };
  }
  export class Error {
    constructor(public errorCode: ErrorCode) {}
    static make(errorCode: ErrorCode) {
      return new Error(errorCode);
    }
  }