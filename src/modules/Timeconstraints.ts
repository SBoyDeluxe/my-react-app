

/**Represents the timeconstraints imposed on a project or feature ;
 * 
 * ->(its)start date, end date, completion date
 * 
 * 
 */
export class TimeConstraints{

    constructor(startdate: Date, enddate: Date){
    this.startdate = startdate;
    this.enddate = enddate;


}
    /**The start date of work on a feature or project */
    private _startdate: Date;
    public get startdate(): string {
        return this.dateToString(this._startdate);
    }
    public set startdate(value: Date) {
        this._startdate = value;
    }
    /**The expected end date of work on a feature or project */
    private _enddate: Date;
    public get enddate(): string {
        return this.dateToString(this._enddate);
    }
    public set enddate(value: Date) {
        this._enddate = value;
    }
    /**The completion date of a feature or project, null if incomplete */
    private _completiondate: Date|null = null;
    public get completiondate(): string|null{
           if (this._completiondate) {
                let completionYear = this._completiondate.getFullYear();
    let completionMonth = this._completiondate.getMonth();
    let completionDay = this._completiondate.getDate();
    let completionHours = this._completiondate.getHours();
    let completionMinutes = this._completiondate.getMinutes();
        return `${completionYear} - ${completionMonth} - ${completionDay} - ${completionHours} - ${completionMinutes} `;
    } else {
        return null
    }
    }
    public set completiondate(value:Date) {
    this._completiondate = value;    }

    completionTime:Date|null = null;
  


/** Takes in a date and converts to a readable string
 * 
 * @param {Date} dateToConvert 
 * @returns {string} dateString : Format (year - month - day)
 */
private  dateToString(dateToConvert: Date): string {

    const year = dateToConvert.getFullYear();
    const month = dateToConvert.getMonth();
    const day = dateToConvert.getDate();
    return `${year} - ${month} - ${day} `;
}
/**Sets the completion date to now
 * 
 */
public  completeConstraint() {
    let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let currentDay = new Date().getDate();
let currentHours = new Date().getHours();
let currentMinutes = new Date().getMinutes();
let currentSeconds = new Date().getSeconds();
let currentMilliseconds = new Date().getMilliseconds();
let utcTimestamp = Date.UTC(currentYear, currentMonth, currentDay, currentHours, currentMinutes, currentSeconds, currentMilliseconds);
    this._completiondate = new Date(utcTimestamp);
   
}
/**
 * 
 * @param inDate The date to be converted into UTC-parameters (day, year....)
 * @returns UTCParameters - Ex : year : 2025, month : 8, day : 12....
 */
public static getLocalTimeParameters(inDate : Date){


const dateYear = inDate.getFullYear();
const dateMonth = inDate.getMonth();
const dateDay = inDate.getDate();
const dateHours = inDate.getHours();
const dateMinutes = inDate.getMinutes();
const dateSeconds = inDate.getSeconds();
const dateMilliseconds = inDate.getMilliseconds();

return {
    year : dateYear,
    month : dateMonth,
    day : dateDay, 
    hour : dateHours,
    minutes : dateMinutes,
    seconds : dateSeconds,
    miliSeconds :dateMilliseconds


}
}

}



