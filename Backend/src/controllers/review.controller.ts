import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  @Get(':productId')
  async findByProduct(@Param('productId') productId: string) {
    try {
      this.logger.log(`Fetching reviews for product ID: ${productId}`);
      const reviews = await this.reviewService.findByProduct(productId);
      return reviews;
    } catch (error) {
      this.logger.error(`Error fetching reviews: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    try {
      this.logger.log(`Creating a new review`);
      const review = await this.reviewService.create(createReviewDto);
      return review;
    } catch (error) {
      this.logger.error(`Error creating review: ${error.message}`, error.stack);
      throw new HttpException(
        'Error creating review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    try {
      this.logger.log(`Updating review ID: ${reviewId}`);
      const updatedReview = await this.reviewService.update(
        reviewId,
        updateReviewDto,
      );
      return updatedReview;
    } catch (error) {
      this.logger.error(`Error updating review: ${error.message}`, error.stack);
      throw new HttpException(
        'Error updating review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}