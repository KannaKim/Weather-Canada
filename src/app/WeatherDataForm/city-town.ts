import { ProvinceDetail } from "./province-detail";

interface CityTownDetail {
    name:string
    province:ProvinceDetail
}
export interface CityTown {
    items:Array<CityTownDetail>
}
