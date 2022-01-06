import { ErrorCodes, Error } from "./error";
import { Config, TimeUnit, InputPeriod, Period } from "./types";
import { PeriodValidator } from "./validators";

export  class IBusy {
  private _config: Config | undefined;
  private timeUnit: TimeUnit = TimeUnit.millSeconds;
  private periodValidator: PeriodValidator = new PeriodValidator();
  constructor() {
    this._config = {
      dateFormat: "YYYY-MM-DDTHH:mm:ss.sssZ",
      locale: "en-US"
    };
  }
  /**
   * get the allowed periods between these periods, also can be into different days
   * @param allowedPeriods 
   * @param disallowedPeriods 
   * @returns 
   */
  getAllowedPeriodsBetween(allowedPeriods: InputPeriod[], disallowedPeriods: InputPeriod[]): Period[] | null {

    const transformedAllowedPeriods: Period[] = [];
    for (const allowedPeriod of allowedPeriods) {
      if (!this.periodValidator.isEndDateAfterStartDate(allowedPeriod)) {
        throw Error.make(ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE);
      } else if (!this.periodValidator.isUniquePeriod(transformedAllowedPeriods, allowedPeriod)) {
        throw Error.make(ErrorCodes.ER_EXISTS_INTO_ALLOW_PERIODS);
      }
      transformedAllowedPeriods.push(this.transformToPeriod(allowedPeriod));
    }
    const transformedDisallowedPeriods: Period[] = [];
    for (const disallowedPeriod of disallowedPeriods) {
      if (!this.periodValidator.isEndDateAfterStartDate(disallowedPeriod)) {
        throw Error.make(ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE);
      } else if (!this.periodValidator.isUniquePeriod(transformedDisallowedPeriods, disallowedPeriod)) {
        throw Error.make(ErrorCodes.ER_EXISTS_INTO_Disallowed_PERIODS);
      }
      transformedDisallowedPeriods.push(this.transformToPeriod(disallowedPeriod));
    }
    if(!transformedAllowedPeriods?.length) return transformedAllowedPeriods;
    else if(!transformedDisallowedPeriods?.length) return transformedDisallowedPeriods;
    const filteredAvailablePeriods: Period[] = this.sortingAndMergePeriods(transformedAllowedPeriods);
    const filteredAppointmentPeriods: Period[] = this.sortingAndMergePeriods(transformedDisallowedPeriods);
    const filteredAllowedPeriods: Period[] = [];
    for (const allowedPeriod of filteredAvailablePeriods) {
      let currentPeriodStartTime = allowedPeriod.startTime;
      let currentPeriodEndTime = allowedPeriod.endTime;
      let disallowedPeriodsIndex = 0;
      while (disallowedPeriodsIndex < filteredAppointmentPeriods.length) {
        const disAllowedPeriod = filteredAppointmentPeriods[disallowedPeriodsIndex];
        if (
          disAllowedPeriod.startTime <= currentPeriodStartTime &&
          disAllowedPeriod.endTime > currentPeriodStartTime &&
          disAllowedPeriod.endTime < currentPeriodEndTime
        ) {
          currentPeriodStartTime = disAllowedPeriod.endTime;
        } else if (disAllowedPeriod.startTime > currentPeriodStartTime) {
          currentPeriodEndTime = disAllowedPeriod.startTime;
          filteredAllowedPeriods.push({
            start: this.convertToDate(currentPeriodStartTime),
            end: this.convertToDate(currentPeriodEndTime),
            startTime: currentPeriodStartTime,
            endTime: currentPeriodEndTime,
            duration: currentPeriodEndTime - currentPeriodStartTime
          });
          if (disAllowedPeriod.endTime > currentPeriodStartTime && disAllowedPeriod.endTime < allowedPeriod.endTime) {
            currentPeriodStartTime = disAllowedPeriod.endTime;
          }
          currentPeriodEndTime = allowedPeriod.endTime;
        }
        if (disallowedPeriodsIndex === filteredAppointmentPeriods.length - 1 && disAllowedPeriod.endTime < allowedPeriod.endTime) {
          currentPeriodStartTime = disAllowedPeriod.endTime;
          currentPeriodEndTime = allowedPeriod.endTime;
          filteredAllowedPeriods.push({
            start: this.convertToDate(currentPeriodStartTime),
            end: this.convertToDate(currentPeriodEndTime),
            startTime: currentPeriodStartTime,
            endTime: currentPeriodEndTime,
            duration: currentPeriodEndTime - currentPeriodStartTime
          });
        }
        disallowedPeriodsIndex++;
      }
    }

    return filteredAllowedPeriods;
  }
  /**
   * transform the input period to the period of type ca i use into ibusy 
   * @param inputPeriod 
   * @returns 
   */
  transformToPeriod(inputPeriod: InputPeriod): Period {
    return {
      start: this.convertToDate(this.convertDateToUnit(inputPeriod.start, TimeUnit.millSeconds)),
      end: this.convertToDate(this.convertDateToUnit(inputPeriod.end, TimeUnit.millSeconds)),
      startTime: this.convertDateToUnit(inputPeriod.start, this.timeUnit),
      endTime: this.convertDateToUnit(inputPeriod.end, this.timeUnit),
      duration: this.convertDateToUnit(inputPeriod.end, this.timeUnit) - this.convertDateToUnit(inputPeriod.start, this.timeUnit)
    };
  }
  /**
   * convert the date of milliseconds to date object
   * @param millSeconds 
   * @returns 
   */
  convertToDate(millSeconds: number): string {
    return new Date(millSeconds).toISOString();
  }
  /**
   * convert the date as string formatted in "YYYY-MM-DDTHH:mm:ss.sssZ" to selected unit 
   * @param date 
   * @param unit 
   * @returns 
   */
  convertDateToUnit(date: string, unit: TimeUnit): number {
    const millSeconds = new Date(date).getTime();
    const timezoneMillSeconds = 0; //new Date().getTimezoneOffset() * 60 * 1000;
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
  /**
   * get a filtered periods after remove every overlapped periods and sorting them
   * @param periods the period has overlapped periods 
   * @returns 
   */
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
