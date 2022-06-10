"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBusy = void 0;
var error_1 = require("./error");
var validators_1 = require("./validators");
var IBusy = /** @class */ (function () {
    function IBusy() {
        this.periodValidator = new validators_1.PeriodValidator();
    }
    /**
     * get the allowed periods between these periods, also can be into different days
     * @param allowedPeriods
     * @param disallowedPeriods
     * @returns
     */
    IBusy.prototype.getAllowedPeriodsBetween = function (allowedPeriods, disallowedPeriods) {
        var transformedAllowedPeriods = [];
        for (var _i = 0, allowedPeriods_1 = allowedPeriods; _i < allowedPeriods_1.length; _i++) {
            var allowedPeriod = allowedPeriods_1[_i];
            if (!this.periodValidator.isEndDateAfterStartDate(allowedPeriod)) {
                throw error_1.Error.make(error_1.ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE);
            }
            else if (!this.periodValidator.isUniquePeriod(transformedAllowedPeriods, allowedPeriod)) {
                throw error_1.Error.make(error_1.ErrorCodes.ER_EXISTS_INTO_ALLOW_PERIODS);
            }
            transformedAllowedPeriods.push(this.transformToPeriod(allowedPeriod));
        }
        var transformedDisallowedPeriods = [];
        for (var _a = 0, disallowedPeriods_1 = disallowedPeriods; _a < disallowedPeriods_1.length; _a++) {
            var disallowedPeriod = disallowedPeriods_1[_a];
            if (!this.periodValidator.isEndDateAfterStartDate(disallowedPeriod)) {
                throw error_1.Error.make(error_1.ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE);
            }
            else if (!this.periodValidator.isUniquePeriod(transformedDisallowedPeriods, disallowedPeriod)) {
                throw error_1.Error.make(error_1.ErrorCodes.ER_EXISTS_INTO_Disallowed_PERIODS);
            }
            transformedDisallowedPeriods.push(this.transformToPeriod(disallowedPeriod));
        }
        if (!(transformedAllowedPeriods === null || transformedAllowedPeriods === void 0 ? void 0 : transformedAllowedPeriods.length))
            return transformedAllowedPeriods;
        else if (!(transformedDisallowedPeriods === null || transformedDisallowedPeriods === void 0 ? void 0 : transformedDisallowedPeriods.length))
            return transformedDisallowedPeriods;
        var filteredAvailablePeriods = this.sortingAndMergePeriods(transformedAllowedPeriods);
        var filteredAppointmentPeriods = this.sortingAndMergePeriods(transformedDisallowedPeriods);
        var filteredAllowedPeriods = [];
        for (var _b = 0, filteredAvailablePeriods_1 = filteredAvailablePeriods; _b < filteredAvailablePeriods_1.length; _b++) {
            var allowedPeriod = filteredAvailablePeriods_1[_b];
            var currentPeriodStartTime = allowedPeriod.start;
            var currentPeriodEndTime = allowedPeriod.end;
            var disallowedPeriodsIndex = 0;
            while (disallowedPeriodsIndex < filteredAppointmentPeriods.length) {
                var disAllowedPeriod = filteredAppointmentPeriods[disallowedPeriodsIndex];
                if (disAllowedPeriod.start <= currentPeriodStartTime &&
                    disAllowedPeriod.end > currentPeriodStartTime &&
                    disAllowedPeriod.end < currentPeriodEndTime) {
                    currentPeriodStartTime = disAllowedPeriod.end;
                }
                else if (disAllowedPeriod.start > currentPeriodStartTime) {
                    currentPeriodEndTime = disAllowedPeriod.start;
                    filteredAllowedPeriods.push({
                        start: currentPeriodStartTime,
                        end: currentPeriodEndTime,
                        duration: currentPeriodEndTime - currentPeriodStartTime,
                    });
                    if (disAllowedPeriod.end > currentPeriodStartTime &&
                        disAllowedPeriod.end < allowedPeriod.end) {
                        currentPeriodStartTime = disAllowedPeriod.end;
                    }
                    currentPeriodEndTime = allowedPeriod.end;
                }
                if (disallowedPeriodsIndex === filteredAppointmentPeriods.length - 1 &&
                    disAllowedPeriod.end < allowedPeriod.end) {
                    currentPeriodStartTime = disAllowedPeriod.end;
                    currentPeriodEndTime = allowedPeriod.end;
                    filteredAllowedPeriods.push({
                        start: currentPeriodStartTime,
                        end: currentPeriodEndTime,
                        duration: currentPeriodEndTime - currentPeriodStartTime,
                    });
                }
                disallowedPeriodsIndex++;
            }
        }
        return filteredAllowedPeriods;
    };
    /**
     * transform the input period to the period
     * @param inputPeriod
     * @returns
     */
    IBusy.prototype.transformToPeriod = function (inputPeriod) {
        return {
            start: inputPeriod.start,
            end: inputPeriod.end,
            duration: inputPeriod.end - inputPeriod.start,
        };
    };
    /**
     * convert the date of milliseconds to date object
     * @param millSeconds
     * @returns
     */
    IBusy.prototype.convertToDate = function (millSeconds) {
        return new Date(millSeconds).toString();
    };
    /**
     * get a filtered periods after remove every overlapped periods and sorting them
     * @param periods the period has overlapped periods
     * @returns
     */
    IBusy.prototype.sortingAndMergePeriods = function (periods) {
        var mergedPeriods = [];
        periods = periods.sort(function (prev, current) {
            if (prev.start < current.start)
                return -1;
            else if (prev.start > current.start)
                return 1;
            return 0;
        });
        var currentPeriodIndex = 0;
        var currentPeriodStart = periods[currentPeriodIndex].start;
        var currentPeriodEnd = periods[currentPeriodIndex].end;
        while (currentPeriodIndex < periods.length) {
            if (!periods[currentPeriodIndex + 1]) {
                mergedPeriods.push({
                    start: currentPeriodStart,
                    end: currentPeriodEnd,
                    duration: currentPeriodEnd - currentPeriodStart,
                });
                break;
            }
            var nextPeriodStart = periods[currentPeriodIndex + 1].start;
            var nextPeriodEnd = periods[currentPeriodIndex + 1].end;
            if (nextPeriodEnd > currentPeriodEnd &&
                nextPeriodStart < currentPeriodEnd &&
                nextPeriodStart > currentPeriodStart) {
                currentPeriodEnd = nextPeriodEnd;
            }
            else if (currentPeriodEnd === nextPeriodStart) {
                currentPeriodEnd = nextPeriodEnd;
            }
            else if (nextPeriodStart > currentPeriodEnd) {
                mergedPeriods.push({
                    start: currentPeriodStart,
                    end: currentPeriodEnd,
                    duration: currentPeriodEnd - currentPeriodStart,
                });
                currentPeriodStart = nextPeriodStart;
                currentPeriodEnd = nextPeriodEnd;
            }
            currentPeriodIndex++;
        }
        return mergedPeriods;
    };
    return IBusy;
}());
exports.IBusy = IBusy;
