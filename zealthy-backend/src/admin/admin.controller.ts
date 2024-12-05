import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common'
import { UpdatePageConfigDto } from './dto/update-page-config.dto'

@Controller('admin')
export class AdminController {
  private pageConfig = {
    page2: ['aboutMe', 'birthdate'],
    page3: ['street', 'city', 'state', 'zip'],
  }

  @Get()
  getPageConfig() {
    return this.pageConfig
  }

  @Post()
  updatePageConfig(@Body() config: UpdatePageConfigDto) {
    if (config.page2.length === 0 || config.page3.length === 0) {
      throw new BadRequestException('Each step must have at least one field.')
    }
    this.pageConfig = config
    return this.pageConfig
  }
}
