import { IBusy } from ".";
import { Period, TimeUnit } from ".";


test("IBusy is defined", () => {
  const ibusy = new IBusy();
  expect(ibusy).toBeDefined();
});

test("getAllowedPeriodsBetween", () => {
  const ibusy = new IBusy();
  const filteredAllowedPeriods: Period[] | null = ibusy.getAllowedPeriodsBetween(
    [{ start: "2021-12-29T05:00:00.000Z", end: "2021-12-29T22:00:00.000Z" }],
    [
      { start: "2021-12-29T06:00:00.000Z", end: "2021-12-29T12:00:00.000Z" },
      { start: "2021-12-29T13:00:00.000Z", end: "2021-12-29T21:00:00.000Z" }
    ]
  );
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

test("convertTo24Time", () => {
  const ibusy = new IBusy();
  const date = "2021-12-29T10:00:00.000Z";
  const result = ibusy.convertToDate(new Date(date).getTime());
  expect(result).toEqual(date);
});
test("convertDateToUnit", () => {
  const ibusy = new IBusy();
  let result: number = ibusy.convertDateToUnit("2021-12-29T02:00:00.000Z", TimeUnit.hours);
  expect(result).toEqual(455762);
  result = ibusy.convertDateToUnit("2021-12-29T10:00:00.000Z", TimeUnit.minutes);
  expect(result).toEqual(27346200);
  result = ibusy.convertDateToUnit("2021-12-29T20:00:00.000Z", TimeUnit.seconds);
  expect(result).toEqual(1640808000);
});

test("sortingAndMergePeriods", () => {
  const ibusy = new IBusy();
  const filteredPeriods: Period[] = ibusy.sortingAndMergePeriods([
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
