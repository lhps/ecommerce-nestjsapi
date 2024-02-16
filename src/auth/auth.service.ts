import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const users = [
  {
    id: 1,
    username: 'john',
    password: 'john'
  },
  {
    id: 2,
    username: 'chris',
    password: 'chris'
  },
  {
    id: 3,
    username: 'lucas.pinho',
    password: 'pinho'
  }
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  login(username: string, password: string) {
    const user = users.find(
      (user) => user.username === username && user.password === password
    ); // alterar depois para logica de procurar pelo username e validar a senha passada com a senha criptografada no banco

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
