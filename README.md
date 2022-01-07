[![npm version](https://badge.fury.io/js/ibusy.svg)](https://badge.fury.io/js/ibusy) [![CI/CD](https://github.com/mahmoudshahin1111/ibusy/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/mahmoudshahin1111/ibusy/actions/workflows/test.yml)

# IBusy

![logo](https://github.com/mahmoudshahin1111/ibusy/blob/master/e2e/logo.png)

IBusy tool can help you to create and enhance your time management tools and make them better and easier to make them because IBusy has great features that can help you in that.

1 - By IBusy you can get the free period between multiple periods
Ex..
likes if you have a person and he is working in specifics times also he has holidays and absences and times he isn't available into so you can get only the times he available into between these periods.

2 - By IBusy you can filter and sort the duplication between multiple periods
Ex..
if you have many dates and periods into an array and you need to remove the duplications and nested array
and get only the unique periods like that

[Demo](https://mahmoudshahin1111.github.io/ibusy/)


## Install

```
npm i ibusy
```


```javascript
[
   { start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T15:00:00.000Z" }
   { start: "2021-12-29T14:00:00.000Z", end: "2021-12-29T16:00:00.000Z" }
   { start: "2021-12-29T16:00:00.000Z", end: "2021-12-29T20:00:00.000Z" }
   { start: "2021-12-29T19:00:00.000Z", end: "2021-12-29T23:00:00.000Z" }
   { start: "2021-12-29T21:00:00.000Z", end: "2021-12-29T23:00:00.000Z" }
]
```

You will get the unique period only

```javascript
[{ start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T23:00:00.000Z" }];
```

Tecnology and Dependances:

| Name   | Version |
| ------ | ------- |
| moment | 2.29.1  |

Dev

| Name       | Version |
| ---------- | ------- |
| typescript | 4.5.4   |
| jest       | 27.0.3  |

## let's know how we can do that

Just simple to get the free periods.

1 - enter the allowed periods.
2 - ender the disallowed periods.
3 - get the free or available periods by calling `getAllowedPeriodsBetween`
 function just simple 😉.

```typescript
const ibusy = new IBusy();
const periods = ibusy.getAllowedPeriodsBetween(
  [{ start: "2021-12-29T05:00:00.000Z", end: "2021-12-29T22:00:00.000Z" }],
  [
    { start: "2021-12-29T06:00:00.000Z", end: "2021-12-29T12:00:00.000Z" },
    { start: "2021-12-29T13:00:00.000Z", end: "2021-12-29T21:00:00.000Z" }
  ]
);
```

## Functions

### getAllowedPeriodsBetween

pass your allowed and disallowed periods as arguments then IBusy will return the allowed periods after remove the disallowed periods sorted and filtered and detailed so you can use after that.

#### Inputs

| Name              | Type                 | Required | Description                                                           |
| ----------------- | -------------------- | -------- | --------------------------------------------------------------------- |
| allowedPeriods    | `Array<InputPeriod>` | true     | array of type `InputPeriod` for the available or allowed periods      |
| disallowedPeriods | `Array<InputPeriod>` | true     | array of type `InputPeriod` for the unavailable or disallowed periods |

#### Outputs

| Type                 | Required | Description                                                                                                            |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Array<InputPeriod>` | true     | array of type `InputPeriod` for the available or allowed periods between the two inputs allowed and disallowed periods |

## Types

`InputPeriod`

| Name  | Type     | Required | Description                                         | Example                  |
| ----- | -------- | -------- | --------------------------------------------------- | ------------------------ |
| start | `string` | true     | date as string formatted `YYYY-MM-DDTHH:mm:ss.sssZ` | 2021-12-29T10:00:00.000Z |
| end   | `string` | true     | date as string formatted `YYYY-MM-DDTHH:mm:ss.sssZ` | 2021-12-29T10:00:00.000Z |

`Period`

| Name      | Type   | Required | example                  | Description                                                 |
| --------- | ------ | -------- | ------------------------ | ----------------------------------------------------------- |
| start     | string | true     | 2021-12-29T10:00:00.000Z | the date as string into ISO format                          |
| end       | string | true     | 2021-12-29T23:00:00.000Z | the date as string into ISO format                          |
| startTime | number | true     | 360000                   | the start date into milliseconds                            |
| endTime   | number | true     | 360000                   | the end date into milliseconds                              |
| duration  | number | true     | 480                      | the difference between end and start date into milliseconds |

## Contribution

I welcome you to fork and add more features into it. If you have any bugs or feature request, please create an issue at [github repository](https://github.com/mahmoudshahin1111/ibusy/issues).