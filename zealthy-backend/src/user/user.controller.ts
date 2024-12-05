import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOne(+id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.findOne(+id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return this.userService.remove(+id)
  }
}
