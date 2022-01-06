const { IBusy } = require("../dist/ibusy");

const ibusy = new IBusy();

const periods = ibusy.getAllowedPeriodsBetween(
  [{ start: "2021-12-29T05:00:00.000Z", end: "2021-12-29T22:00:00.000Z" }],
  [
    { start: "2021-12-29T06:00:00.000Z", end: "2021-12-29T12:00:00.000Z" },
    { start: "2021-12-29T13:00:00.000Z", end: "2021-12-29T21:00:00.000Z" }
  ]
);

console.log(periods);
