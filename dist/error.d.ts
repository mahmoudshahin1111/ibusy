export interface ErrorCode {
    key: number;
    description: string;
}
export declare class ErrorCodes {
    static readonly ER_PERIOD_START_DATE_AFTER_END_DATE: ErrorCode;
    static readonly ER_INVALID_PERIOD: ErrorCode;
    static readonly ER_EXISTS_INTO_ALLOW_PERIODS: ErrorCode;
    static readonly ER_EXISTS_INTO_Disallowed_PERIODS: ErrorCode;
}
export declare class Error {
    errorCode: ErrorCode;
    constructor(errorCode: ErrorCode);
    static make(errorCode: ErrorCode): Error;
}
