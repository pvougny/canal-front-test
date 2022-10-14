import { Controller, Get, HttpStatus, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { MoviesService, Movie } from './movies.service';

@Controller('movies')
@UseGuards(AuthGuard, ThrottlerGuard)
export class MoviesController {
  service: MoviesService;

  constructor(service: MoviesService) {
    this.service = service;
  }

  @Get('/')
  search(@Query('query') query?: string, @Query('sortBy') sortBy?: string): Movie[] {
    return this.service.getMovies(query, sortBy)
  }

  @Get('/:id')
  get(@Param('id') id: string, @Res() res: Response) {
    const movie = this.service.getMovie(id);
    if (!movie) return res.status(HttpStatus.NOT_FOUND).end();
    return res.json(movie);
  }
}
