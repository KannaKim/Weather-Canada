import { WeatherDetail } from "./weather-detail";

interface TempDetail{
    temp:number;
    temp_min:number;
    temp_max:number;
}
export interface ListDetail{
    dt:number;
    main:TempDetail;
    weather:Array<WeatherDetail>;
}
export interface Weather5dayForecastDataForm {
    list:Array<ListDetail>
}
