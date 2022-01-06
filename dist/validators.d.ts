import { InputPeriod } from "./types";
export declare class PeriodValidator {
    isEndDateAfterStartDate(period: InputPeriod): boolean;
    isUniquePeriod(periods: InputPeriod[], period: InputPeriod): boolean;
}
