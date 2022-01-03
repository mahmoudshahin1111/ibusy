import { InputPeriod } from "./types";

export class PeriodValidator {
    isPeriodDateIsValid(period: InputPeriod) {
      const isEndDateGreaterThanStartDate = new Date(period.end).getTime() - new Date(period.start).getTime();
      if (isEndDateGreaterThanStartDate <= 0) return false;
      return true;
    }
  }
  
  