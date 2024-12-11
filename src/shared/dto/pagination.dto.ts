import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { SortEnum } from '../enum/common.enum';

export class PaginationDto {
  @ApiProperty({
    name: 'limit',
    description: 'The maximum number of items to retrieve (optional)',
    type: Number,
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10), { toClassOnly: true })
  @Min(1, { message: 'limit must not be less than 1' })
  limit: number = 10;

  @ApiProperty({
    name: 'offset',
    description: 'The offset for pagination (optional)',
    type: Number,
    required: false,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10), { toClassOnly: true })
  @Min(1, { message: 'Offset must not be less than 1' })
  offset: number = 1;

  @ApiPropertyOptional({
    name: 'search',
    description: 'Search (optional)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    name: 'sortField',
    description: 'The field to sort by (optional)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiPropertyOptional({
    name: 'sortOrder',
    description: 'The sort order (optional)',
    type: String,
    required: false,
    default: SortEnum.DESC,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortEnum, {
    message: `Sort order must be from [${Object.values(SortEnum).join(', ')}]`,
  })
  sortOrder?: SortEnum = SortEnum.DESC;

  @ApiPropertyOptional({
    name: 'startDate',
    description: 'StartDate for date filter (optional)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    name: 'endDate',
    description: 'EndDate for date filter (optional)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextPageToken?: string;
}
