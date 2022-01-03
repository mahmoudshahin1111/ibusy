
export enum TimeUnit {
    hours,
    minutes,
    seconds,
    millSeconds
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
  