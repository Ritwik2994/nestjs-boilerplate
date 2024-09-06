import { IsArray, IsNumber, IsString } from 'class-validator';

export default class LocationDto {
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];

  @IsString()
  city_name: string;

  @IsString()
  display_name: string;

  @IsNumber()
  place_id: number;
}
