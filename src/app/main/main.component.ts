import { Component, OnInit } from '@angular/core';
import { WeatherDataForm } from '../WeatherDataForm/weather-data-form';
import { WeatherDataService } from '../weather-data.service';
import { CityNameService } from '../city-name.service';
import { CityDataForm } from '../CityNameForm/city-data-form';
import { ListDetail, Weather5dayForecastDataForm } from '../WeatherDataForm/weather-5day-forecast-data-form';
import { DailyDetail } from '../WeatherDataForm/daily-detail';
import { CityTown } from '../WeatherDataForm/city-town';
import { Historical5day } from '../WeatherDataForm/historical-5day';
import { HourlyDetail } from '../WeatherDataForm/hourly-detail';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  current_loc_fontsize = "55px"
  header_degree_fontsize = "120px"

  current_temp:number
  current_local_hour_and_min:string // hh:mm based
  current_local_day:string // Monday, Tuesday ... Sunday 
  city:string;
  province:string;
  fd_averaged_temp_high= new Array<number>(5).fill(0);
  fd_averaged_temp_low= new Array<number>(5).fill(0);
  fd_averaged_weather_icon = new Array<string>(5).fill("");
  fd_day_list = new Array<string>(5).fill("");
  searchList_elemets= []

  right_now_weather_icon:string =""

  multi= [
    {
      "name": "temperature",
      "series": [
      ]
    }
  ];


  view: any[] = [500, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Temperature';
  timeline: boolean = true;


  fahrenheight_clicked = true; 
  celsius_clicked = false;  //celsius makes more sense as measurment btw 
  measurement = "imperial"

  constructor(private weather:WeatherDataService, private cns:CityNameService) { 
    navigator.geolocation.getCurrentPosition((position)=>{
      this.updateWeather(position.coords.latitude,position.coords.longitude,this.measurement)
      this.cns.fetchCityOrTownDataByCoords(position.coords.latitude, position.coords.longitude).subscribe(
        (data:CityTown)=>{
          this.city= data.items[0].name
          this.province = this.cns.getProvinceNameByCode(parseInt(data.items[0].province.code))
          let date = new Date(Date.now())
          this.current_local_day = this.weather.getDayfromIndex(date.getDay())
          this.current_local_hour_and_min = this.weather.getHourAndMinInFormat(date.getHours(), date.getMinutes())
        })
    })


    // this.mockData()

    
  }

  
  ngOnInit(): void {
  }
  
  fahrenheit_onclick(){
    if(this.celsius_clicked){  //cel -> fah  = (0°C × 9/5) + 32 = 32°F
      for(let i in this.fd_averaged_temp_high){
        this.fd_averaged_temp_high[i] = Math.round((this.fd_averaged_temp_high[i]*9/5) +32)
        this.fd_averaged_temp_low[i] = Math.round((this.fd_averaged_temp_low[i]*9/5) +32)
      }
      for(let i in this.multi[0].series){
        this.multi[0].series[i].value = Math.round(((this.multi[0].series[i].value*9/5) +32)*10)/10
      }
      this.multi = [...this.multi]
      this.current_temp = Math.round((this.current_temp*9/5)+32)
    }


    this.celsius_clicked = false
    this.measurement = "imperial"
    this.fahrenheight_clicked = true
    this.dynamicFontSize()
  }
  celsius_onclick(){
    if(this.fahrenheight_clicked){  //fah -> cel  = (°F − 32) × 5/9 
      for(let i in this.fd_averaged_temp_high){
        this.fd_averaged_temp_high[i] = Math.round((this.fd_averaged_temp_high[i]-32)*5/9)
        this.fd_averaged_temp_low[i] =  Math.round((this.fd_averaged_temp_low[i]-32)*5/9)
      }
      for(let i in this.multi[0].series){
        this.multi[0].series[i].value = Math.round(((this.multi[0].series[i].value-32)*5/9)*10)/10
      }
      this.multi = [...this.multi]
      this.current_temp = Math.round((this.current_temp-32)*5/9)
    }
    this.celsius_clicked = true
    this.measurement = "metric"
    this.fahrenheight_clicked = false
    this.dynamicFontSize() 
  }
  mockData(){
    this.fd_averaged_temp_high= new Array<number>(5).fill(13);
    this.fd_averaged_temp_low= new Array<number>(5).fill(-13);
    this.fd_averaged_weather_icon = new Array<string>(5).fill("04d");
    this.fd_day_list = new Array<string>(5).fill("Monday");
    
    this.right_now_weather_icon ="04d"

    this.current_temp = 23
    this.current_local_hour_and_min="02:03 AM" // hh:mm AMPMbased
    this.current_local_day= "Sunday" // Monday, Tuesday ... Sunday 
    this.city = "Virden";
    this.province = "MB";
    this.dynamicFontSize()

  }

  dynamicFontSize(){
    if(this.current_temp.toString().length>2){
    this.header_degree_fontsize =  (120-(this.current_temp.toString().length-2)*20)+"px"  // default 120px when 2digits -> 100px when 3 digits
    }
    if(this.city.length > 5){
      this.current_loc_fontsize = (55-(this.city.length-5)*2)+"px"
    }
  }

  mostOccurence(arr:Array<string>):string{
      return arr.sort((a,b) =>
            arr.filter(v => v===a).length
          - arr.filter(v => v===b).length
      ).pop();
  }
  feed_on_past_weather_data(hourly_data:Array<HourlyDetail>){
    // let r_past_daily_data = past_daily_data.reverse()
    // for(let p_d of r_past_daily_data){
    //   let date = new Date(p_d.dt*1000)
    //   let data_to_add = {"name":`${date.getMonth()+1}/${date.getDate()}`, "value":Math.round(p_d.temp.day)}
    //   this.multi[0].series.push(data_to_add)
    //   this.multi = [...this.multi]
    // }  
    // console.log("multi",this.multi)
    let series_temp =[]
    for(let hr of hourly_data){ 
      let date = new Date(hr.dt*1000)
      let data_to_add = {"name":`${this.weather.getHourAndMinInFormat(date.getHours(),0)}`, "value": Math.round(hr.temp*10)/10}
      series_temp.push(data_to_add)
    }
    this.multi[0].series = series_temp
    this.multi = [...this.multi]
  }


  updateWeather(lat:number,lon:number,measurement:string){
    this.weather.fetchWeatherData(lat,lon,measurement).subscribe((data:WeatherDataForm)=>{
      this.current_temp=Math.round(data.current.temp);
      this.right_now_weather_icon = data.current.weather[0].icon
      this.dynamicFontSize()  //update fotsize dynamically depending on city len
    })
    this.weather.getHistorical5dWeatherData(lat, lon, measurement).subscribe((data:Historical5day)=>{
      this.feed_on_past_weather_data(data.hourly)
    })
    this.weather.fetch5dayWeatherForecast(lat,lon, measurement).subscribe((data:Weather5dayForecastDataForm)=>{
      let startingDate:number = new Date(data.list[0].dt*1000).getDate();
      let date_i=0;
      let temp_high:Array<number> = [];
      let temp_low:Array<number> = [];
      let weather_icon:Array<string> = []; // cloudy, sunny etc 

      for(let i=0; i< data.list.length; i++){ 
        let li = data.list[i];
        let iteratingDate = new Date(li.dt*1000).getDate();
        let iteratingDay = this.weather.getDayfromIndex(new Date(li.dt*1000).getDay());
        let today = new Date(Date.now()).getDate()
          if(iteratingDate==startingDate){ // meaning they're on the same date -> put it on list -> pick highest/lowest when date changes
            temp_high.push(li.main.temp_max);
            temp_low.push(li.main.temp_min);
            weather_icon.push(li.weather[0].icon);
            if(this.fd_day_list.includes(iteratingDay)==false){
              this.fd_day_list[date_i] = iteratingDay;
            }
          }
          else if(iteratingDate!=startingDate){ 
            
            this.fd_averaged_temp_high[date_i] = Math.round(Math.max(...temp_high));
            this.fd_averaged_temp_low[date_i] = Math.round(Math.min(...temp_low))
            this.fd_averaged_weather_icon[date_i] = this.mostOccurence(weather_icon)
            
            if(startingDate != today)
            {            
              date_i+=1
            }

            startingDate = iteratingDate; //re-initializing
            temp_high = []
            temp_low = []
            weather_icon = []
          }
          if(i == data.list.length-1){
            this.fd_averaged_temp_high[date_i] = Math.round(Math.max(...temp_high));
            this.fd_averaged_temp_low[date_i] = Math.round(Math.min(...temp_low))

            this.fd_averaged_weather_icon[date_i] = this.mostOccurence(weather_icon)  // so the last one still goes valid 
          }
          console.log("icon\n"+this.fd_averaged_weather_icon[i])
      }
    })
  }
  onEnter(searchValue:string){
    if(searchValue.includes(",")){ // it'll either be like Virden, MB
      let s_city:string = searchValue.split(",")[0]   //searched city
      let s_province_code:number = this.cns.getCodeByProvince(searchValue.split(",")[1].replace(" ",""))
      this.cns.fetchCityDataByTerm(s_city,s_province_code).subscribe((data:CityDataForm)=>{
        if(data.items.length == 0){
          throw `server failed to fetch data! for s_city:${s_city} and s_province:${s_province_code} `
        }
          this.city = data.items[0].name
          this.province = this.cns.getProvinceNameByCode(parseInt(data.items[0].province.code))
          let lat = data.items[0].latitude
          let lon = data.items[0].longitude
          this.updateWeather(lat,lon,this.measurement)
      })
    }
  }
  onSearchChange(searchValue:string,limiter=5){
    this.searchItemsFromSearchBar(searchValue)
  }
  searchItemsFromSearchBar(searchValue:string,limiter=5){
    this.searchList_elemets= []
    if(searchValue!=""){
      this.cns.fetchCityDataByTerm(searchValue).subscribe((data:CityDataForm)=>{

          for(let item of data.items){
            let city_and_prov:string = `${item.name}, ${this.cns.getProvinceNameByCode(parseInt(item.province.code))}`
            if(this.searchList_elemets.includes(city_and_prov)==false){
              this.searchList_elemets.push(city_and_prov)
            }
            if(this.searchList_elemets.length>=limiter){
              break;
            }
          }
        })
      }
    }
}
