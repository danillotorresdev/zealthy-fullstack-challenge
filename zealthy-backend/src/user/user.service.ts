import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from '@/user/dto/create-user.dto'
import { User } from '@prisma/client'
export interface UserWithAddress extends User {
  address?: {
    street: string
    city: string
    state: string
    zip: string
  } | null
}
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        aboutMe: createUserDto.aboutMe,
        birthdate: createUserDto.birthdate
          ? new Date(createUserDto.birthdate)
          : null,
        address: createUserDto.address
          ? {
              create: {
                street: createUserDto.address.street,
                city: createUserDto.address.city,
                state: createUserDto.address.state,
                zip: createUserDto.address.zip,
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    })
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        address: true,
      },
    })
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
      },
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        address: true,
      },
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const dataToUpdate = {
      email: updateUserDto.email ?? user.email,
      password: updateUserDto.password ?? user.password,
      aboutMe: updateUserDto.aboutMe ?? user.aboutMe,
      birthdate: updateUserDto.birthdate
        ? new Date(updateUserDto.birthdate)
        : user.birthdate,
      address: updateUserDto.address
        ? {
            upsert: {
              create: {
                street: updateUserDto.address.street,
                city: updateUserDto.address.city,
                state: updateUserDto.address.state,
                zip: updateUserDto.address.zip,
              },
              update: {
                street: updateUserDto.address.street,
                city: updateUserDto.address.city,
                state: updateUserDto.address.state,
                zip: updateUserDto.address.zip,
              },
            },
          }
        : undefined,
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      include: {
        address: true,
      },
    })
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.user.delete({
      where: { id },
    })
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword)
  }

  determineStep(user: any): number {
    if (user.address) {
      return 3
    }
    if (user.aboutMe || user.birthdate) {
      return 2
    }
    return 1
  }
}
