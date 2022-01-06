import { TimeUnit, InputPeriod, Period } from "./types";
export declare class IBusy {
    private _config;
    private timeUnit;
    private periodValidator;
    constructor();
    /**
     * get the allowed periods between these periods, also can be into different days
     * @param allowedPeriods
     * @param disallowedPeriods
     * @returns
     */
    getAllowedPeriodsBetween(allowedPeriods: InputPeriod[], disallowedPeriods: InputPeriod[]): Period[] | null;
    /**
     * transform the input period to the period of type ca i use into ibusy
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
     * convert the date as string formatted in "YYYY-MM-DDTHH:mm:ss.sssZ" to selected unit
     * @param date
     * @param unit
     * @returns
     */
    convertDateToUnit(date: string, unit: TimeUnit): number;
    /**
     * get a filtered periods after remove every overlapped periods and sorting them
     * @param periods the period has overlapped periods
     * @returns
     */
    sortingAndMergePeriods(periods: Period[]): Period[];
}
