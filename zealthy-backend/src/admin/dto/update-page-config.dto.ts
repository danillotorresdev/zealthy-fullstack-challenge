import { IsArray, IsNotEmpty } from 'class-validator'

export class UpdatePageConfigDto {
  @IsArray()
  @IsNotEmpty({ message: 'Page 2 must have at least one field.' })
  page2: string[]

  @IsArray()
  @IsNotEmpty({ message: 'Page 3 must have at least one field.' })
  page3: string[]
}
