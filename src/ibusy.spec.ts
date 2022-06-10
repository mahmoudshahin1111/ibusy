import { IBusy } from ".";
import { Period } from ".";

test("IBusy is defined", () => {
  const ibusy = new IBusy();
  expect(ibusy).toBeDefined();
});

test("#getAllowedPeriodsBetween should return the allowed periods", () => {
  const ibusy = new IBusy();
  const filteredAllowedPeriods: Period[] | null =
    ibusy.getAllowedPeriodsBetween(
      [
        {
          start: new Date("2021-12-29T01:00:00.000Z").getTime(),
          end: new Date("2021-12-29T22:00:00.000Z").getTime(),
        },
      ],
      [
        {
          start: new Date("2021-12-29T02:00:00.000Z").getTime(),
          end: new Date("2021-12-29T21:00:00.000Z").getTime(),
        },
      ]
    );
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

test("convertTo24Time", () => {
  const ibusy = new IBusy();
  const date = "2021-12-29T10:00:00.000Z";
  const result = ibusy.convertToDate(new Date(date).getTime());
  expect(result).toEqual(new Date(date).toString());
});

test("sortingAndMergePeriods", () => {
  const ibusy = new IBusy();
  const filteredPeriods: Period[] = ibusy.sortingAndMergePeriods([
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
