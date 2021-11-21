import { HourlyDetail } from "./hourly-detail";

interface HistoricalDetail{
    dt:number
    temp:number
}
export interface Historical5day {
    lat:number
    lon:number
    current:HistoricalDetail
    hourly:Array<HourlyDetail>
}
