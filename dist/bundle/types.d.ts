export declare enum TimeUnit {
    hours = 0,
    minutes = 1,
    seconds = 2,
    millSeconds = 3
}
export interface Period {
    start: string;
    end: string;
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
