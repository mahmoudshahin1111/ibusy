import * as ibusy from './index';


test("free periods are generated and correct",()=>{
    const freePeriods:ibusy.Period[] = ibusy.default
    .addAvailabilityPeriod({date:'1-1-2021',startTime:'00:00',endTime:'12:00'})
    .addAppointmentPeriod({date:'1-1-2021',startTime:'02:00',endTime:'03:00'})
    .addAppointmentPeriod({date:'1-1-2021',startTime:'05:00',endTime:'06:00'})
    .getFreePeriods();
    expect(freePeriods).toEqual({});
});



