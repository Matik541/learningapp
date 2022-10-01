import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'LearningApp.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // change to false in production mode
      synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
