import { InputPeriod, Period } from "./types";
export declare class IBusy {
    private periodValidator;
    /**
     * get the allowed periods between these periods, also can be into different days
     * @param allowedPeriods
     * @param disallowedPeriods
     * @returns
     */
    getAllowedPeriodsBetween(allowedPeriods: InputPeriod[], disallowedPeriods: InputPeriod[]): Period[] | null;
    /**
     * transform the input period to the period
     * @param inputPeriod
     * @returns
     */
    transformToPeriod(inputPeriod: InputPeriod): Period;
    /**
     * convert the date of milliseconds to date object
     * @param millSeconds
     * @returns
     */
    convertToDate(millSeconds: number): string;
    /**
     * get a filtered periods after remove every overlapped periods and sorting them
     * @param periods the period has overlapped periods
     * @returns
     */
    sortingAndMergePeriods(periods: Period[]): Period[];
}
