import { AuthDto } from '@/auth/dto/auth.dto'
import { UserService } from '@/user/user.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginOrRegister(authDto: AuthDto) {
    const user = await this.userService.findByEmail(authDto.email)

    if (user) {
      const isPasswordValid = await this.userService.comparePassword(
        authDto.password,
        user.password,
      )

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials')
      }
      const step = this.userService.determineStep(user)

      const token = this.jwtService.sign({ email: user.email, id: user.id })
      const { password, ...userWithoutPassword } = user
      return { token, step, user: userWithoutPassword }
    }

    const newUser = await this.userService.create(authDto)
    const token = this.jwtService.sign({
      email: newUser.email,
      id: newUser.id,
    })

    const step = this.userService.determineStep(newUser)

    const { password, ...newUserWithoutPassword } = newUser
    return { token, step, user: newUserWithoutPassword }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      const user = await this.userService.findByEmail(payload.email)
      if (!user) {
        throw new UnauthorizedException('Invalid token')
      }
      const { password, ...userWithoutPassword } = user
      const step = this.userService.determineStep(user)
      return {
        user: userWithoutPassword,
        currentStep: step,
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
