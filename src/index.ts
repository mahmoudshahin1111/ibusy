import * as moment from "moment";

export interface ErrorCode {
  key: number;
  description: string;
}
export class ErrorCodes {
  public static readonly ER_1: ErrorCode = { key: 1, description: "this period exists" };
}
export class Error {
  constructor(public errorCode: ErrorCode) {}
  static make(errorCode: ErrorCode) {
    return new Error(errorCode);
  }
}
export enum TimeUnit {
  hours,
  minutes,
  seconds,
  millSeconds
}
export interface Period {
  start: Date;
  end: Date;
  startTime: number;
  endTime: number;
  duration: number;
}
export interface InputPeriod {
  start: string;
  end: string;
}
export interface Config {
  dateFormat: string;
  locale: string;
}

export class PeriodValidator {
  isPeriodDateIsValid(period: InputPeriod) {
    const isEndDateGreaterThanStartDate = new Date(period.end).getTime() - new Date(period.start).getTime();
    if (!isEndDateGreaterThanStartDate) return false;
    return true;
  }
}

export class IBusy {
  private _config: Config | undefined;
  private availabilityPeriods: Period[] = [];
  private appointmentPeriods: Period[] = [];
  private timeUnit: TimeUnit = TimeUnit.millSeconds;
  private periodValidator: PeriodValidator = new PeriodValidator();
  private error: Error | undefined | null;
  constructor() {
    this._config = {
      dateFormat: "YYYY-MM-DDTHH:mm:ss.sssZ",
      locale: "en-US"
    };
  }
  addAvailabilityPeriod(period: InputPeriod) {
    if (!this.isPeriodValid(period)) {
      this.error = Error.make(ErrorCodes.ER_1);
      return this;
    }
    const transformedPeriod = this.transformToPeriod(period);
    this.availabilityPeriods.push(transformedPeriod);
    return this;
  }
  addAppointmentPeriod(period: InputPeriod) {
    if (!this.isPeriodValid(period)) {
      this.error = Error.make(ErrorCodes.ER_1);
      return this;
    }
    const transformedPeriod = this.transformToPeriod(period);
    this.appointmentPeriods.push(transformedPeriod);
    return this;
  }
  getFreePeriods(): Period[] | null {
    if (this.error) {
      console.error(this.error);
      return null;
    }
    /*
      1- convert the period start and end times to be mins for every day.
      2- start loop on availability periods and get all the appointment cut this appointment time 
      3- if the appointment start time greater than the available start time add as a new free period 
      4- take the end of this appointment as a new start time 
      5- repeat 3
      6- if there aren't any new appointments between the available period then 
      if start time less than the end of the availability period add a new free period  
      
    */
    const freePeriods: Period[] = [];
    this.availabilityPeriods.forEach((availabilityPeriod) => {
      let startTime = availabilityPeriod.startTime;
      let endTime = availabilityPeriod.endTime;
      this.appointmentPeriods.forEach((appointmentPeriod) => {
        if (appointmentPeriod.startTime > availabilityPeriod.startTime && appointmentPeriod.endTime < availabilityPeriod.endTime) {
          endTime = appointmentPeriod.startTime;
          freePeriods.push({
            start: this.convertToDate(startTime),
            end: this.convertToDate(endTime),
            startTime,
            endTime,
            duration: endTime - startTime
          });
        }
        startTime = appointmentPeriod.endTime;
      });
      if (endTime < availabilityPeriod.endTime) {
        freePeriods.push({
          start: this.convertToDate(startTime),
          end: this.convertToDate(endTime),
          startTime,
          endTime,
          duration: endTime - startTime
        });
      }
    });
    return freePeriods;
  }

  transformToPeriod(inputPeriod: InputPeriod): Period {
    return {
      start:this.convertToDate(this.convertDateToUnit(inputPeriod.start,TimeUnit.millSeconds)),
      end:this.convertToDate(this.convertDateToUnit(inputPeriod.end, TimeUnit.millSeconds)),
      startTime: this.convertDateToUnit(inputPeriod.start, this.timeUnit),
      endTime: this.convertDateToUnit(inputPeriod.end, this.timeUnit),
      duration: this.convertDateToUnit(inputPeriod.end, this.timeUnit) - this.convertDateToUnit(inputPeriod.start, this.timeUnit)
    };
  }
  convertToDate(millSeconds: number):Date {
    return new Date(millSeconds);
  }
  convertDateToUnit(date: string, unit: TimeUnit): number {
    const millSeconds = new Date(date).getTime();
    const timezoneMillSeconds = new Date().getTimezoneOffset() * 60 * 1000;
    switch (unit) {
      case TimeUnit.hours:
        return (millSeconds + timezoneMillSeconds) / (60 * 60 * 1000);
      case TimeUnit.minutes:
        return (millSeconds + timezoneMillSeconds) / (60 * 1000);
      case TimeUnit.seconds:
        return (millSeconds + timezoneMillSeconds) / 1000;
      default:
        return millSeconds + timezoneMillSeconds;
    }
  }
  isPeriodValid(period: InputPeriod) {
    return this.periodValidator.isPeriodDateIsValid(period);
  }
  sortingAndMergePeriods(periods: Period[]): Period[] {
    const mergedPeriods: Period[] = [];
    periods = periods.sort((prev: Period, current: Period) => {
      if (prev.start < current.start) return -1;
      else if (prev.start > current.start) return 1;
      return 0;
    });
    let currentPeriodIndex = 0;
    let currentPeriodStart: number = periods[currentPeriodIndex].startTime;
    let currentPeriodEnd: number = periods[currentPeriodIndex].endTime;

    while (currentPeriodIndex < periods.length) {
      if (!periods[currentPeriodIndex + 1]) {
        mergedPeriods.push({
          start: this.convertToDate(currentPeriodStart),
          end: this.convertToDate(currentPeriodEnd),
          startTime: currentPeriodStart,
          endTime: currentPeriodEnd,
          duration: currentPeriodEnd - currentPeriodStart
        });
        break;
      }
      let nextPeriodStart: number = periods[currentPeriodIndex + 1].startTime;
      let nextPeriodEnd: number = periods[currentPeriodIndex + 1].endTime;
      if (nextPeriodEnd > currentPeriodEnd && nextPeriodStart < currentPeriodEnd && nextPeriodStart > currentPeriodStart) {
        currentPeriodEnd = nextPeriodEnd;
      } else if (currentPeriodEnd === nextPeriodStart) {
        currentPeriodEnd = nextPeriodEnd;
      } else if (nextPeriodStart > currentPeriodEnd) {
        mergedPeriods.push({
          start: this.convertToDate(currentPeriodStart),
          end: this.convertToDate(currentPeriodEnd),
          startTime: currentPeriodStart,
          endTime: currentPeriodEnd,
          duration: currentPeriodEnd - currentPeriodStart
        });
        currentPeriodStart = nextPeriodStart;
        currentPeriodEnd = nextPeriodEnd;
      }
      currentPeriodIndex++;
    }
    return mergedPeriods;
  }
}

export default new IBusy();
