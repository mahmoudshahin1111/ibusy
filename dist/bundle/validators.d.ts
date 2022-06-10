import { InputPeriod, Period } from "./types";
export declare class PeriodValidator {
    isEndDateAfterStartDate(period: InputPeriod): boolean;
    isUniquePeriod(periods: Period[], period: InputPeriod): boolean;
}
