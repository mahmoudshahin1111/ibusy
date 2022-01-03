import { ErrorCodes, Error } from "./error";
import { Config, TimeUnit, InputPeriod, Period } from "./types";
import { PeriodValidator } from "./validators";

export class IBusy {
  private _config: Config | undefined;
  private timeUnit: TimeUnit = TimeUnit.millSeconds;
  private periodValidator: PeriodValidator = new PeriodValidator();
  constructor() {
    this._config = {
      dateFormat: "YYYY-MM-DDTHH:mm:ss.sssZ",
      locale: "en-US"
    };
  }
  getAllowedPeriodsBetween(allowedPeriods: InputPeriod[], disallowedPeriods: InputPeriod[]): Period[] | null {
    const transformedAllowedPeriods: Period[] = [];
    for (const allowedPeriod of allowedPeriods) {
      if (!this.isPeriodValid(allowedPeriod)) {
        throw Error.make(ErrorCodes.ER_1);
      }
      transformedAllowedPeriods.push(this.transformToPeriod(allowedPeriod));
    }
    const transformedDisallowedPeriods: Period[] = [];
    for (const disallowedPeriod of disallowedPeriods) {
      if (!this.isPeriodValid(disallowedPeriod)) {
        throw Error.make(ErrorCodes.ER_1);
      }
      transformedDisallowedPeriods.push(this.transformToPeriod(disallowedPeriod));
    }
    const filteredAllowedPeriods: Period[] = [];
    const filteredAvailablePeriods: Period[] = this.sortingAndMergePeriods(transformedAllowedPeriods);
    const filteredAppointmentPeriods: Period[] = this.sortingAndMergePeriods(transformedDisallowedPeriods);
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
  transformToPeriod(inputPeriod: InputPeriod): Period {
    return {
      start: this.convertToDate(this.convertDateToUnit(inputPeriod.start, TimeUnit.millSeconds)),
      end: this.convertToDate(this.convertDateToUnit(inputPeriod.end, TimeUnit.millSeconds)),
      startTime: this.convertDateToUnit(inputPeriod.start, this.timeUnit),
      endTime: this.convertDateToUnit(inputPeriod.end, this.timeUnit),
      duration: this.convertDateToUnit(inputPeriod.end, this.timeUnit) - this.convertDateToUnit(inputPeriod.start, this.timeUnit)
    };
  }
  convertToDate(millSeconds: number): string {
    return new Date(millSeconds).toISOString();
  }
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
