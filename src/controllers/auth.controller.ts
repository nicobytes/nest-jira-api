import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';
import { TokenPayload } from '@models/token.model';
import { User } from '@db/entities/user.entity';
import { CheckEmailDto, ChangePasswordDto } from '@dtos/auth.dto';
import { CreateUserDto } from '@dtos/user.dto';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return {
      access_token: this.authService.generateAccessToken(user),
      refresh_token: '---',
      user,
    };
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('is-available')
  checkEmail(@Body() dto: CheckEmailDto) {
    return this.authService.isAvailable(dto.email);
  }

  @Post('recovery')
  recovery(@Body() dto: CheckEmailDto) {
    return this.authService.sendRecovery(dto.email);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.usersService.findUserById(user?.userId);
  }
}
