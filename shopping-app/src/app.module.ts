import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

const userName: string = 'msunaam';
const password: string = '0nmhP1NgUpIQ01tB';
const dbName: string = 'SE-Project';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      `mongodb+srv://${userName}:${password}@se-project.yxnsmaq.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
