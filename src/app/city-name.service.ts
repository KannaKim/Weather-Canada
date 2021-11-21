import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CityNameService {

  constructor(private http:HttpClient) {
    
  }
  getCodeByProvince(province:string):number{
    let result:number;
    //according to http://geogratis.gc.ca/services/geoname/en/codes/province
    switch(province){
      case "NL":
        result = 10;
        break;
      case "PE":
        result = 11;
        break;
      case "NS":
        result = 12;
        break;
      case "NB":
        result = 13;
        break;
      case "QC":
        result = 24;
        break;
      case "ON":
        result = 35;
        break;
      case "MB":
        result = 46;
        break;
      case "SK":
        result = 47;
        break;
      case "AB":
        result = 48;
        break;
      case "BC":
        result = 59;
        break;
      case "YU":
        result = 60;
        break;
      case "NT":
        result = 61;
        break;
      case "NU":
        result = 62;
        break;
      case "UF":
        result = 72;
        break;
      case "IW":
        result = 73;
        break;
    }
    return result
  }
  getProvinceNameByCode(code:number):string{
    let result:string;
    //according to http://geogratis.gc.ca/services/geoname/en/codes/province
    switch(code){
      case 10:
        result = "NL";
        break;
      case 11:
        result = "PE";
        break;
      case 12:
        result = "NS";
        break;
      case 13:
        result = "NB";
        break;
      case 24:
        result = "QC";
        break;
      case 35:
        result = "ON";
        break;
      case 46:
        result = "MB";
        break;
      case 47:
        result = "SK";
        break;
      case 48:
        result = "AB";
        break;
      case 59:
        result = "BC";
        break;
      case 60:
        result = "YU";
        break;
      case 61:
        result = "NT";
        break;
      case 62:
        result = "NU";
        break;
      case 72:
        result = "UF";
        break;
      case 73:
        result = "IW";
        break;
    }
    return result
  }
  fetchCityOrTownDataByCoords(lat:number,lon:number){
    return this.http.get(`https://geogratis.gc.ca/services/geoname/en/geonames.json?lat=${lat}&lon=${lon}&concise=TOWN&concise=CITY`)
  }
  fetchCityDataByTerm(q:string,province?:number){
    if(q==""){
      throw `q is empty`
    }
    else{
      if(province == undefined){
        return this.http.get("https://geogratis.gc.ca/services/geoname/en/geonames.json?q="+q)
      }
      else{
        return this.http.get(`https://geogratis.gc.ca/services/geoname/en/geonames.json?q=${q}&province=${province}`)
      }
    } 
  }
}
