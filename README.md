# ibusy

IBusy tool can help you to created and enhanecment your time management tools and make them better and easier to make them because IBusy has a great features can help you in that.
1- By IBusy you can get the free period between multaple periods 
Ex..
likes if you have a person and he is working in spacifice times also he has holidays and absences and times he isn't available into so you can get only the times he available into between these periods 
2- By IBusy you can filter and sort the duplication between multiable periods 
Ex..
if you have many dates and periods into an array and you need to remove the duplications and nested array 
and get only the unique periods like that 
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
[
{ start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T23:00:00.000Z" }
]
```
Tecnology and Dependances:

|Name| Version     |
| ----------- | ----------- |
|   moment    |   2.29.1    |

## let's know how we can do that 

Just simple to get the free periods 
1- enter the allowed periods.
2- ender the disallowed periods.
3- get the free or available periods 
```typescript 
    const freePeriods = 
    ibusy.addAvailabilityPeriod({ start: "2021-12-29T05:00:00.000Z", end: "2021-12-29T22:00:00.000Z" }) // Work from 2021-12-29 05:00 to 2021-12-29 22:00
    .addAppointmentPeriod({ start: "2021-12-29T10:00:00.000Z", end: "2021-12-29T12:00:00.000Z" }) // Off from 2021-12-29 10:00 to 2021-12-29 12:00
    .addAppointmentPeriod({ start: "2021-12-29T13:00:00.000Z", end: "2021-12-29T15:00:00.000Z" }) // Off from 2021-12-29 13:00 to 2021-12-29 15:00
    .getFreePeriods();
```

## Functions

### addAvailabilityPeriod

add an allowed period and it takes 1 argument of type `Period` and you can repeat this function to add more periods as you want

#### Inputs
|Name|  Type   | Required  |   example   | Description |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|   start     | string  |   2021-12-29T10:00:00.000Z | the date as string into ISO format |
|   end     | string  |   2021-12-29T23:00:00.000Z | the date as string into ISO format |

### Returns 
Refrance to `IBusy` object

### addAppointmentPeriod

add an disallowed period and it takes 1 argument of type `Period`   and you can repeat this function to add more periods as you want

#### Inputs
|Name|  Type   | Required  |   example   | Description |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|   start     | string  |   2021-12-29T10:00:00.000Z | the date as string into ISO format |
|   end     | string  |   2021-12-29T23:00:00.000Z | the date as string into ISO format |

### Returns 
Refrance to `IBusy` object

### getFreePeriods

call this after you accully added your allowed and disallowed periods so IBusy will return the allowed periods after remove the disallowed periods.

#### Outputs
|Name|  Type   | Required  |   example   | Description |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|   start     | string  |   2021-12-29T10:00:00.000Z | the  start of the time you are will be available as ISO date format  |
|   end     | string  |   2021-12-29T23:00:00.000Z |  the  end of the time you are will be available as ISO date format  |

## Types

### Period

|             |  Type   | Required  |   example   | Description |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|   start     | string  |   2021-12-29T10:00:00.000Z | the date as string into ISO format |
|   end       | string  |   2021-12-29T23:00:00.000Z | the date as string into ISO format |

