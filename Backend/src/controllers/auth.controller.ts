import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto, SignInDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { address, email, firstName, lastName, phone } = signUpDto;

    try {
      this.logger.log(`Signing up user with email: ${email}`);
      this.logger.debug(
        `User details - First Name: ${firstName}, Last Name: ${lastName}, Phone: ${phone}, Address: ${address}`,
      );

      const result = await this.authService.signUp(signUpDto);
      this.logger.log(`User signed up successfully: ${result.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error signing up user: ${error.message}`, error.stack);
      throw new HttpException(
        'Error signing up user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      this.logger.log(`Signing in user: ${signInDto.identifier}`);
      const result = await this.authService.signIn(signInDto);
      this.logger.log(`User signed in successfully: ${result.user.email}`);
      console.log(result);
      return result;
    } catch (error) {
      this.logger.error(`Error signing in user: ${error.message}`, error.stack);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
