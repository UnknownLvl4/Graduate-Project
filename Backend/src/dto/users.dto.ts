import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}

export class UpdateUserDto {
    @IsOptional() 
    @IsString()
    firstName?: string;

    @IsOptional() 
    @IsString()
    lastName?: string;

    @IsOptional() 
    @IsEmail()
    email?: string;

    @IsOptional() 
    @IsString()
    phone?: string;

    @IsOptional() 
    @IsString()
    address?: string;

    @IsOptional() 
    @IsBoolean()
    isAdmin?: boolean;
}