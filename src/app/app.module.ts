import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from 'src/company/company.module';
import { FilesModule } from 'src/files/files.module';
import { ProfileModule } from 'src/profile/profile.module';
import { VacancyModule } from 'src/vacancy/vacancy.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CompanyModule,
    VacancyModule,
    FilesModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
