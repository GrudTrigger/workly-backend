import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
