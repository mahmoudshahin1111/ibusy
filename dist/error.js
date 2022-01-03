"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.ErrorCodes = void 0;
var ErrorCodes = /** @class */ (function () {
    function ErrorCodes() {
    }
    ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE = { key: 1, description: "period start time greater than the end time" };
    ErrorCodes.ER_INVALID_PERIOD = { key: 2, description: "invalid period the period format should be on this format YYYY-MM-DDTHH:mm:ss.sssZ" };
    ErrorCodes.ER_EXISTS_INTO_ALLOW_PERIODS = { key: 3, description: "the date exists into allowed periods" };
    ErrorCodes.ER_EXISTS_INTO_Disallowed_PERIODS = { key: 4, description: "the date exists into disallowed periods" };
    return ErrorCodes;
}());
exports.ErrorCodes = ErrorCodes;
var Error = /** @class */ (function () {
    function Error(errorCode) {
        this.errorCode = errorCode;
    }
    Error.make = function (errorCode) {
        return new Error(errorCode);
    };
    return Error;
}());
exports.Error = Error;
