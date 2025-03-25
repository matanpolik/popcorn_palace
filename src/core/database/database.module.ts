import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseConfig],
  exports: [DatabaseConfig],
})
export class DatabaseModule {}
