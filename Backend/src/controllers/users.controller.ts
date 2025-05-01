import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    try {
      this.logger.log('Fetching all users');
      return await this.usersService.findAll();
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching user with ID: ${id}`);
      return await this.usersService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching user: ${error.message}`, error.stack);
      throw new HttpException(
        'Error fetching user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.log('Creating a new user');
      return await this.usersService.create(createUserDto);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      this.logger.log(`Updating user with ID: ${id}`);
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new HttpException(
        'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting user with ID: ${id}`);
      return await this.usersService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new HttpException(
        'Error deleting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}