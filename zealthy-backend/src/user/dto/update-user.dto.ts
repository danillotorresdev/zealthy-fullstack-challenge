import { AddressDto } from '@/common/dto/address.dto'
import { IsOptional, IsString, IsDateString } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsString()
  aboutMe?: string

  @IsOptional()
  @IsDateString()
  birthdate?: string

  @IsOptional()
  address?: AddressDto
}
