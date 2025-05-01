import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { User } from 'src/entities/user.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
      @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByProduct(productId: string): Promise<any[]> {
    const reviews = await this.reviewRepository.find({
      where: { product_id: productId },
    });
    return Promise.all(
      reviews.map(async (review) => {
        const user = await this.userRepository.findOne({
          where: { id: review.user_id },
        });
        if (!user) throw new Error('User not found');

        return {
          ...review,
          email: user.email || null,
        };
      }),
    );
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      created_at: new Date(),
    });
    return this.reviewRepository.save(review);
  }

  async update(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async delete(reviewId: string): Promise<void> {
    const result = await this.reviewRepository.delete(reviewId);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
  }
}
