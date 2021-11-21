interface ProvinceDetail{
    code:string;
}
interface CityDetail{
    latitude:number;
    longitude:number;
    province:ProvinceDetail;
    name:string;
}
export interface CityDataForm {
    items:Array<CityDetail>;
}

