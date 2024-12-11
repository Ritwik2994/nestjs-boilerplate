import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UserProfileDto {
  @ApiPropertyOptional({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The username of the user',
    example: 'johndoe123',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'A short biography of the user',
    example: 'I am a software developer passionate about creating amazing applications.',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: "URL of the user's profile image",
    example: 'https://example.com/images/johndoe.jpg',
  })
  @IsUrl()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    description: "URL of the user's banner image",
    example: 'https://example.com/images/johndoe-banner.jpg',
  })
  @IsUrl()
  @IsOptional()
  bannerImage?: string;

  @ApiPropertyOptional({
    description: 'Facebook profile link of the user',
    example: 'https://www.facebook.com/johndoe',
  })
  @IsUrl()
  @IsOptional()
  fbLink?: string;

  @ApiPropertyOptional({
    description: 'X (formerly Twitter) profile link of the user',
    example: 'https://x.com/johndoe',
  })
  @IsUrl()
  @IsOptional()
  xLink?: string;

  @ApiProperty({
    description: 'Indicates whether the user account is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
