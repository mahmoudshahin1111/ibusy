import * as ibusy from "./index";

test("IBusy is defined", () => {
  expect(ibusy.default).toBeDefined();
});

test("getFreePeriods", () => {
  const freePeriods: ibusy.Period[] | null = ibusy.default
    .addAvailabilityPeriod({ start: "2021-12-29T05:00:00.000Z", end: "2021-12-29T22:00:00.000Z" })
    .addAppointmentPeriod({ start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T12:00:00.000Z" })
    .addAppointmentPeriod({ start: "2021-12-29T13:00:00.000Z", end: "2021-12-29T15:00:00.000Z" })
    .getFreePeriods();
  expect(freePeriods?.length).toBeDefined();
});

test("convertTo24Time", () => {
    const date = new Date("2021-12-29T10:00:00.000Z");
  const result = ibusy.default.convertToDate(date.getTime());
  expect(result).toEqual(date);
});
test("convertDateToUnit", () => {
  let result: number = ibusy.default.convertDateToUnit("2021-12-29T02:00:00.000Z", ibusy.TimeUnit.hours);
  expect(result).toEqual(455760);
  result = ibusy.default.convertDateToUnit("2021-12-29T10:00:00.000Z", ibusy.TimeUnit.minutes);
  expect(result).toEqual(27346080);
  result = ibusy.default.convertDateToUnit("2021-12-29T20:00:00.000Z", ibusy.TimeUnit.seconds);
  expect(result).toEqual(1640800800);
});

test("sortingAndMergePeriods", () => {
  const filteredPeriods: ibusy.Period[] = ibusy.default.sortingAndMergePeriods([
    ibusy.default.transformToPeriod({ start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T15:00:00.000Z" }),
    ibusy.default.transformToPeriod({ start: "2021-12-29T14:00:00.000Z", end: "2021-12-29T16:00:00.000Z" }),
    ibusy.default.transformToPeriod({ start: "2021-12-29T16:00:00.000Z", end: "2021-12-29T20:00:00.000Z" }),
    ibusy.default.transformToPeriod({ start: "2021-12-29T19:00:00.000Z", end: "2021-12-29T23:00:00.000Z" }),
    ibusy.default.transformToPeriod({ start: "2021-12-29T21:00:00.000Z", end: "2021-12-29T23:00:00.000Z" })
  ]);
  expect(filteredPeriods).toEqual([{ duration: 46800000, end: new Date(1640811600000), endTime: 1640811600000, start: new Date(1640764800000), startTime: 1640764800000 }]);
});
