import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { AdminModule } from '@/admin/admin.module'
import { AuthModule } from '@/auth/auth.module'

@Module({
  imports: [AuthModule, UserModule, AdminModule, PrismaModule],
})
export class AppModule {}