import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 1,
    })
  ],
  controllers: [MoviesController, AuthController],
  providers: [MoviesService, AuthService],
})
export class AppModule {}
