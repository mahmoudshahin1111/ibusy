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

## Installation

```html
<script src="https://cdn.jsdelivr.net/npm/ibusy@latest/dist/ibusy.js"></script>
```

Or NPM

```
npm i ibusy
```

## Overview

```html
<script src="https://cdn.jsdelivr.net/npm/ibusy@latest/dist/ibusy.js"></script>
<script>
  const _ibusy = new ibusy.IBusy();
  const periods = _ibusy.getAllowedPeriodsBetween(
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
</script>
```

Get the free or available periods by calling `getAllowedPeriodsBetween` of the global object `ibusy`
and first argument will be the allowed periods.
and second argument will be the disallowed periods.

Just simple 😉.

## API

```javascript
getAllowedPeriodsBetween(allowedPeriods, disallowedPeriods);
```

Pass your allowed and disallowed periods as arguments then IBusy will return the allowed periods after remove the disallowed periods sorted and filtered and detailed so you can use after that.

- Arguments:

| Name              | Type                 | Required | Description                                                           |
| ----------------- | -------------------- | -------- | --------------------------------------------------------------------- |
| allowedPeriods    | `Array<InputPeriod>` | true     | array of type `InputPeriod` for the available or allowed periods      |
| disallowedPeriods | `Array<InputPeriod>` | true     | array of type `InputPeriod` for the unavailable or disallowed periods |

- Returns:

| Type                 | Description                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Array<InputPeriod>` | array of type `InputPeriod` for the available or allowed periods between the two inputs allowed and disallowed periods |

## Types

- `InputPeriod`

| Name  | Type     | Required | Example       | Description              |
| ----- | -------- | -------- | ------------- | ------------------------ |
| start | `number` | true     | 1640739600000 | The date as milliseconds |
| end   | `number` | true     | 1640743200000 | The date as milliseconds |

- `Period`

| Name     | Type     | Required | Example       | Description                                                 |
| -------- | -------- | -------- | ------------- | ----------------------------------------------------------- |
| start    | `number` | true     | 1640739600000 | The date as milliseconds                                    |
| end      | `number` | true     | 1640743200000 | The date as milliseconds                                    |
| duration | `number` | true     | 480           | The difference between end and start date into milliseconds |

- Dependencies:
  | Name | Version |
  | ------ | ------- |
  | moment | 2.29.1 |

- Dev
  | Name | Version |
  | ---------- | ------- |
  | typescript | 4.5.4 |
  | jest | 27.0.3 |

## Contribution

I welcome you to fork and add more features into it. If you have any bugs or feature request, please create an issue at [github repository](https://github.com/mahmoudshahin1111/ibusy/issues).
