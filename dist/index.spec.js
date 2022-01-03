"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
test("IBusy is defined", function () {
    var ibusy = new _1.IBusy();
    expect(ibusy).toBeDefined();
});
test("getAllowedPeriodsBetween", function () {
    var ibusy = new _1.IBusy();
    var filteredAllowedPeriods = ibusy.getAllowedPeriodsBetween([{ start: "2021-12-29T05:00:00.000Z", end: "2021-12-29T22:00:00.000Z" }], [
        { start: "2021-12-29T06:00:00.000Z", end: "2021-12-29T12:00:00.000Z" },
        { start: "2021-12-29T13:00:00.000Z", end: "2021-12-29T21:00:00.000Z" }
    ]);
    expect(filteredAllowedPeriods).toEqual([
        {
            duration: 3600000,
            end: "2021-12-29T06:00:00.000Z",
            endTime: 1640757600000,
            start: "2021-12-29T05:00:00.000Z",
            startTime: 1640754000000
        },
        {
            duration: 3600000,
            end: "2021-12-29T13:00:00.000Z",
            endTime: 1640782800000,
            start: "2021-12-29T12:00:00.000Z",
            startTime: 1640779200000
        },
        {
            duration: 3600000,
            end: "2021-12-29T22:00:00.000Z",
            endTime: 1640815200000,
            start: "2021-12-29T21:00:00.000Z",
            startTime: 1640811600000
        }
    ]);
});
test("convertTo24Time", function () {
    var ibusy = new _1.IBusy();
    var date = "2021-12-29T10:00:00.000Z";
    var result = ibusy.convertToDate(new Date(date).getTime());
    expect(result).toEqual(date);
});
test("convertDateToUnit", function () {
    var ibusy = new _1.IBusy();
    var result = ibusy.convertDateToUnit("2021-12-29T02:00:00.000Z", _1.TimeUnit.hours);
    expect(result).toEqual(455762);
    result = ibusy.convertDateToUnit("2021-12-29T10:00:00.000Z", _1.TimeUnit.minutes);
    expect(result).toEqual(27346200);
    result = ibusy.convertDateToUnit("2021-12-29T20:00:00.000Z", _1.TimeUnit.seconds);
    expect(result).toEqual(1640808000);
});
test("sortingAndMergePeriods", function () {
    var ibusy = new _1.IBusy();
    var filteredPeriods = ibusy.sortingAndMergePeriods([
        ibusy.transformToPeriod({ start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T15:00:00.000Z" }),
        ibusy.transformToPeriod({ start: "2021-12-29T14:00:00.000Z", end: "2021-12-29T16:00:00.000Z" }),
        ibusy.transformToPeriod({ start: "2021-12-29T16:00:00.000Z", end: "2021-12-29T20:00:00.000Z" }),
        ibusy.transformToPeriod({ start: "2021-12-29T19:00:00.000Z", end: "2021-12-29T23:00:00.000Z" }),
        ibusy.transformToPeriod({ start: "2021-12-29T21:00:00.000Z", end: "2021-12-29T23:00:00.000Z" })
    ]);
    expect(filteredPeriods).toEqual([
        { duration: 46800000, end: "2021-12-29T23:00:00.000Z", endTime: 1640818800000, start: "2021-12-29T10:00:00.000Z", startTime: 1640772000000 }
    ]);
});
