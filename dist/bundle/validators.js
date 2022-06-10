"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodValidator = void 0;
var PeriodValidator = /** @class */ (function () {
    function PeriodValidator() {
    }
    PeriodValidator.prototype.isEndDateAfterStartDate = function (period) {
        var isEndDateGreaterThanStartDate = new Date(period.end).getTime() - new Date(period.start).getTime();
        if (isEndDateGreaterThanStartDate <= 0)
            return false;
        return true;
    };
    PeriodValidator.prototype.isUniquePeriod = function (periods, period) {
        return !periods.find(function (existPeriod) { return period.start === existPeriod.start && period.end === existPeriod.end; });
    };
    return PeriodValidator;
}());
exports.PeriodValidator = PeriodValidator;
