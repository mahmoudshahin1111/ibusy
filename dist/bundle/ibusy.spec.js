"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
test("IBusy is defined", function () {
    var ibusy = new _1.IBusy();
    expect(ibusy).toBeDefined();
});
test("#getAllowedPeriodsBetween should return the allowed periods", function () {
    var ibusy = new _1.IBusy();
    var filteredAllowedPeriods = ibusy.getAllowedPeriodsBetween([
        {
            start: new Date("2021-12-29T01:00:00.000Z").getTime(),
            end: new Date("2021-12-29T22:00:00.000Z").getTime(),
        },
    ], [
        {
            start: new Date("2021-12-29T02:00:00.000Z").getTime(),
            end: new Date("2021-12-29T21:00:00.000Z").getTime(),
        },
    ]);
    expect(filteredAllowedPeriods).toEqual([
        {
            duration: 3600000,
            end: 1640743200000,
            start: 1640739600000
        },
        {
            duration: 3600000,
            end: 1640815200000,
            start: 1640811600000
        }
    ]);
});
test("convertTo24Time", function () {
    var ibusy = new _1.IBusy();
    var date = "2021-12-29T10:00:00.000Z";
    var result = ibusy.convertToDate(new Date(date).getTime());
    expect(result).toEqual(new Date(date).toString());
});
test("sortingAndMergePeriods", function () {
    var ibusy = new _1.IBusy();
    var filteredPeriods = ibusy.sortingAndMergePeriods([
        ibusy.transformToPeriod({
            start: new Date("2021-12-29T10:00:00.000Z").getTime(),
            end: new Date("2021-12-29T15:00:00.000Z").getTime(),
        }),
        ibusy.transformToPeriod({
            start: new Date("2021-12-29T14:00:00.000Z").getTime(),
            end: new Date("2021-12-29T16:00:00.000Z").getTime(),
        }),
        ibusy.transformToPeriod({
            start: new Date("2021-12-29T16:00:00.000Z").getTime(),
            end: new Date("2021-12-29T20:00:00.000Z").getTime(),
        }),
        ibusy.transformToPeriod({
            start: new Date("2021-12-29T19:00:00.000Z").getTime(),
            end: new Date("2021-12-29T23:00:00.000Z").getTime(),
        }),
        ibusy.transformToPeriod({
            start: new Date("2021-12-29T21:00:00.000Z").getTime(),
            end: new Date("2021-12-29T23:00:00.000Z").getTime(),
        }),
    ]);
    expect(filteredPeriods).toEqual([
        {
            duration: 46800000,
            end: 1640818800000,
            start: 1640772000000,
        },
    ]);
});
