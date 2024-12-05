import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '@/user/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return this.authService.loginOrRegister(createUserDto)
  }

  @Post('validate')
  async validateToken(@Request() req) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided or malformed')
    }
    const token = authHeader.split(' ')[1]
    return this.authService.validateToken(token)
  }
}
