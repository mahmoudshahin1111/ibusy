export class Errors {
  public static readonly ER_1 = { code: 1, description: "this period exists" };
}

export interface Period {
  date: string;
  startTime: string;
  endTime: string;
  startTimeAsMins: number;
  endAsTimeMins: number;
  duration: number;
}
export interface InputPeriod {
  date: string;
  startTime: string;
  endTime: string;
}

export class IBusy {
  private _format: string = "YYYY-MM-DD H:m:s";
  private _local:string = 'en-US';
  private availabilityPeriods: Period[] = [];
  private appointmentPeriods: Period[] = [];
  setTimeFormat(format: string) {
    this._format = format;
  }
  addAvailabilityPeriod(period: InputPeriod) {
    const transformedPeriod = this.transformToPeriod(period);
    if (this.isPeriodExists(transformedPeriod, this.availabilityPeriods)) throw Errors.ER_1;
    this.availabilityPeriods.push(transformedPeriod);
    return this;
  }
  addAppointmentPeriod(period: InputPeriod) {
    const transformedPeriod = this.transformToPeriod(period);
    if (this.isPeriodExists(transformedPeriod, this.appointmentPeriods)) throw Errors.ER_1;
    this.appointmentPeriods.push(transformedPeriod);
    return this;
  }
  getFreePeriods(): Period[] {
    /*
      1- convert the period start and end times to be mins for every day.
      2- start loop on availability periods and get all the appointment cut this appointment time 
      3- if the appointment start time greater than the available start time add as a new free period 
      4- take the end of this appointment as a new start time 
      5- repeat 3
      6- if there aren't any new appointments between the available period then 
      if start time less than the end of the availability period add a new free period  
      
    */
    const freePeriods: Period[] = [];
    this.availabilityPeriods.forEach((availabilityPeriod) => {
      let startTimeAsMins = availabilityPeriod.startTimeAsMins;
      this.appointmentPeriods.forEach((appointmentPeriod) => {
        if (appointmentPeriod.startTimeAsMins > startTimeAsMins) {
          freePeriods.push({
            date: availabilityPeriod.date,
            startTimeAsMins: startTimeAsMins,
            endAsTimeMins: appointmentPeriod.startTimeAsMins,
            duration: appointmentPeriod.startTimeAsMins - startTimeAsMins,
            startTime: this.convertMinsTo24Time(startTimeAsMins),
            endTime: this.convertMinsTo24Time(appointmentPeriod.startTimeAsMins)
          });
          startTimeAsMins = appointmentPeriod.endAsTimeMins;
        }
      });
      if (startTimeAsMins < availabilityPeriod.endAsTimeMins) {
        freePeriods.push({
          date: availabilityPeriod.date,
          startTimeAsMins: startTimeAsMins,
          endAsTimeMins: availabilityPeriod.endAsTimeMins,
          duration: availabilityPeriod.endAsTimeMins - startTimeAsMins,
          startTime: this.convertMinsTo24Time(startTimeAsMins),
          endTime: this.convertMinsTo24Time(availabilityPeriod.endAsTimeMins)
        });
        startTimeAsMins = availabilityPeriod.endAsTimeMins;
      }
    });

    return freePeriods;
  }
  private transformToPeriod(inputPeriod: InputPeriod): Period {
    return {
      ...inputPeriod,
      endAsTimeMins: this.convertTimeToMins(inputPeriod.endTime),
      startTimeAsMins: this.convertTimeToMins(inputPeriod.startTime),
      duration: this.convertTimeToMins(inputPeriod.endTime) - this.convertTimeToMins(inputPeriod.startTime)
    };
  }
  private convertMinsTo24Time(minutes: number) {
    return `${Math.floor(minutes / 60).toLocaleString(this._local, { minimumIntegerDigits: 2 })}:${Math.floor(minutes % 60).toLocaleString(this._local, {
      minimumIntegerDigits: 2
    })}`;
  }
  private convertTimeToMins(time: string): number {
    const sections = time.split(":");
    const hours = Number(sections[0]);
    const minutes = Number(sections[1]);
    return hours * 60 + minutes;
  }
  private isPeriodExists(period: Period, periods: Period[]) {
    //TODO: check if this period is exists or not.
    return false;
  }
}

export default new IBusy();
