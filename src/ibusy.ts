import { ErrorCodes, Error } from "./error";
import { Config, InputPeriod, Period } from "./types";
import { PeriodValidator } from "./validators";

export class IBusy {
  private periodValidator: PeriodValidator = new PeriodValidator();

  /**
   * get the allowed periods between these periods, also can be into different days
   * @param allowedPeriods
   * @param disallowedPeriods
   * @returns
   */
  getAllowedPeriodsBetween(
    allowedPeriods: InputPeriod[],
    disallowedPeriods: InputPeriod[]
  ): Period[] | null {
    const transformedAllowedPeriods: Period[] = [];
    for (const allowedPeriod of allowedPeriods) {
      if (!this.periodValidator.isEndDateAfterStartDate(allowedPeriod)) {
        throw Error.make(ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE);
      } else if (
        !this.periodValidator.isUniquePeriod(
          transformedAllowedPeriods,
          allowedPeriod
        )
      ) {
        throw Error.make(ErrorCodes.ER_EXISTS_INTO_ALLOW_PERIODS);
      }
      transformedAllowedPeriods.push(this.transformToPeriod(allowedPeriod));
    }
    const transformedDisallowedPeriods: Period[] = [];
    for (const disallowedPeriod of disallowedPeriods) {
      if (!this.periodValidator.isEndDateAfterStartDate(disallowedPeriod)) {
        throw Error.make(ErrorCodes.ER_PERIOD_START_DATE_AFTER_END_DATE);
      } else if (
        !this.periodValidator.isUniquePeriod(
          transformedDisallowedPeriods,
          disallowedPeriod
        )
      ) {
        throw Error.make(ErrorCodes.ER_EXISTS_INTO_Disallowed_PERIODS);
      }
      transformedDisallowedPeriods.push(
        this.transformToPeriod(disallowedPeriod)
      );
    }
    if (!transformedAllowedPeriods?.length) return transformedAllowedPeriods;
    else if (!transformedDisallowedPeriods?.length)
      return transformedDisallowedPeriods;
    const filteredAvailablePeriods: Period[] = this.sortingAndMergePeriods(
      transformedAllowedPeriods
    );
    const filteredAppointmentPeriods: Period[] = this.sortingAndMergePeriods(
      transformedDisallowedPeriods
    );
    const filteredAllowedPeriods: Period[] = [];
    for (const allowedPeriod of filteredAvailablePeriods) {
      let currentPeriodStartTime = allowedPeriod.start;
      let currentPeriodEndTime = allowedPeriod.end;
      let disallowedPeriodsIndex = 0;
      while (disallowedPeriodsIndex < filteredAppointmentPeriods.length) {
        const disAllowedPeriod =
          filteredAppointmentPeriods[disallowedPeriodsIndex];
        if (
          disAllowedPeriod.start <= currentPeriodStartTime &&
          disAllowedPeriod.end > currentPeriodStartTime &&
          disAllowedPeriod.end < currentPeriodEndTime
        ) {
          currentPeriodStartTime = disAllowedPeriod.end;
        } else if (disAllowedPeriod.start > currentPeriodStartTime) {
          currentPeriodEndTime = disAllowedPeriod.start;
          filteredAllowedPeriods.push({
            start: currentPeriodStartTime,
            end: currentPeriodEndTime,
            duration: currentPeriodEndTime - currentPeriodStartTime,
          });
          if (
            disAllowedPeriod.end > currentPeriodStartTime &&
            disAllowedPeriod.end < allowedPeriod.end
          ) {
            currentPeriodStartTime = disAllowedPeriod.end;
          }
          currentPeriodEndTime = allowedPeriod.end;
        }
        if (
          disallowedPeriodsIndex === filteredAppointmentPeriods.length - 1 &&
          disAllowedPeriod.end < allowedPeriod.end
        ) {
          currentPeriodStartTime = disAllowedPeriod.end;
          currentPeriodEndTime = allowedPeriod.end;
          filteredAllowedPeriods.push({
            start: currentPeriodStartTime,
            end: currentPeriodEndTime,
            duration: currentPeriodEndTime - currentPeriodStartTime,
          });
        }
        disallowedPeriodsIndex++;
      }
    }

    return filteredAllowedPeriods;
  }
  /**
   * transform the input period to the period
   * @param inputPeriod
   * @returns
   */
  transformToPeriod(inputPeriod: InputPeriod): Period {
    return {
      start: inputPeriod.start,
      end: inputPeriod.end,
      duration: inputPeriod.end - inputPeriod.start,
    };
  }
  /**
   * convert the date of milliseconds to date object
   * @param millSeconds
   * @returns
   */
  convertToDate(millSeconds: number): string {
    return new Date(millSeconds).toString();
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
    let currentPeriodStart: number = periods[currentPeriodIndex].start;
    let currentPeriodEnd: number = periods[currentPeriodIndex].end;

    while (currentPeriodIndex < periods.length) {
      if (!periods[currentPeriodIndex + 1]) {
        mergedPeriods.push({
          start: currentPeriodStart,
          end: currentPeriodEnd,
          duration: currentPeriodEnd - currentPeriodStart,
        });
        break;
      }
      let nextPeriodStart: number = periods[currentPeriodIndex + 1].start;
      let nextPeriodEnd: number = periods[currentPeriodIndex + 1].end;
      if (
        nextPeriodEnd > currentPeriodEnd &&
        nextPeriodStart < currentPeriodEnd &&
        nextPeriodStart > currentPeriodStart
      ) {
        currentPeriodEnd = nextPeriodEnd;
      } else if (currentPeriodEnd === nextPeriodStart) {
        currentPeriodEnd = nextPeriodEnd;
      } else if (nextPeriodStart > currentPeriodEnd) {
        mergedPeriods.push({
          start: currentPeriodStart,
          end: currentPeriodEnd,
          duration: currentPeriodEnd - currentPeriodStart,
        });
        currentPeriodStart = nextPeriodStart;
        currentPeriodEnd = nextPeriodEnd;
      }
      currentPeriodIndex++;
    }
    return mergedPeriods;
  }
}
