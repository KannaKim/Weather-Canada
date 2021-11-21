import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherDataForm } from './WeatherDataForm/weather-data-form';
@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  api_key:string;
  lat:number;
  lon:number
  constructor(private http:HttpClient) {
    this.api_key = "1bdf8613ad2b19d73633b32b9adedd7d"// shouldn't really do this ik
   }

  fetchWeatherData(lat:number,lon:number, measurement:string){
    if(measurement!="imperial" && measurement!="metric")
    {
      throw `measurement ${measurement} is uknown parameter`
    } 
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${measurement}&exclude=minutely,alerts&appid=${this.api_key}`)
  }
  fetch5dayWeatherForecast(lat:number, lon:number, measurement:string){
    if(measurement!="imperial" && measurement!="metric")
    {
      throw `measurement ${measurement} is uknown parameter`
    } 
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${measurement}&appid=${this.api_key}`)
  }
  getHistorical5dWeatherData(lat:number,lon:number, measurement:string){ //up to 5 days
    if(measurement!="imperial" && measurement!="metric")
    {
      throw `measurement ${measurement} is uknown parameter`
    } 
    let dt_sec = Math.round(Date.now()/1000)-60
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt_sec}&units=${measurement}&appid=${this.api_key}`)
  } 
  sayHi(){
    return "hi"
  }
  getDayfromIndex(i:number,dayFormat="FirestLetterUppercase"){
    if(0>i || 6<i){
      throw `argument i is expecting number range 0~6 but it's ${i}`
    }
    if(dayFormat=="FirestLetterUppercase"){
      return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][i]
    }
    else{
      throw `argument dayFormat: ${dayFormat} is wrong`
    }
  }
  getHourAndMinInFormat(hour:number,min:number,format="H:MM AMPM"){
    let result:string
    if(format == "H:MM AMPM" ){
      let H = hour % 12 
      let M = "0" + min 
      let AMPM = (hour < 12 || hour == 24 )? "AM":"PM"  

      result = `${H}:${M.substr(-2)} ${AMPM}`
    }
    else{
      throw `argument format: ${format} is wrong`
    }
    return result
  }
    

}
