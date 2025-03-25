import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { Movie } from './entities/movie.entity';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'List of all movies',
    type: [Movie],
  })
  async findAll() {
    return await this.movieService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a movie' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Movie created successfully',
    type: Movie,
  })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.movieService.create(createMovieDto);
  }

  @Post('update/:movieTitle')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body() updateMovieDto: CreateMovieDto,
  ) {
    return await this.movieService.updateByTitle(movieTitle, updateMovieDto);
  }

  @Delete(':movieTitle')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  async remove(@Param('movieTitle') movieTitle: string) {
    return await this.movieService.removeByTitle(movieTitle);
  }
}
