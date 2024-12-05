import { AddressDto } from '@/common/dto/address.dto'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsISO8601,
} from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsString()
  aboutMe?: string

  @IsOptional()
  @IsISO8601()
  birthdate?: string

  @IsOptional()
  address?: AddressDto
}
