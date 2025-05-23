import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SignUpDto, SignInDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, firstName, lastName, phone, address } = signUpDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword, // Ensure the hashed password is saved
      firstName,
      lastName,
      phone,
      address,
    });
    await this.userRepository.save(newUser);

    // Create a new cart for the user
    const newCart = this.cartRepository.create({
      cart_id: crypto.randomUUID(),
      user_id: newUser.id,
    });
    await this.cartRepository.save(newCart);

    return { email: newUser.email };
  }

  async signIn(signInDto: SignInDto) {
    const { identifier, password } = signInDto;

    // Find the user by email or phone
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare directly with the stored hash

    // Check if the password is valid
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate a JWT token
    const payload = {
      email: user.email,
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      isAdmin: user.isAdmin,
    };
    const token = this.jwtService.sign(payload);

    return { user: payload, token };
  }
}
