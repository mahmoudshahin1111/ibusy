import { InputPeriod } from "./types";

export class PeriodValidator {
    isEndDateAfterStartDate(period: InputPeriod) {
      const isEndDateGreaterThanStartDate = new Date(period.end).getTime() - new Date(period.start).getTime();
      if (isEndDateGreaterThanStartDate <= 0) return false;
      return true;
    }
    isUniquePeriod(periods: InputPeriod[],period:InputPeriod) {
      return !periods.find(existPeriod=>period === existPeriod);
    }
  }
  
  