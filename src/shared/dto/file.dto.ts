import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class FileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iconType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  uid: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  short_filename: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isImageUrl: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isUploading: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showDownload: boolean;
}
