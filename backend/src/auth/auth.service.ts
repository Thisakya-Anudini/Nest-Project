import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user: UserDocument = await this.usersService.login(email, password);

    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
