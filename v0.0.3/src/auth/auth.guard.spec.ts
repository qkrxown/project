import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';




describe('AuthGuard', () => {
  let authGuard:AuthGuard;


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({envFilePath:'config.env'}),
        JwtModule.register({})
      ],
      providers: [AuthService,AuthGuard]
    }).compile();
    
    authGuard = moduleRef.get<AuthGuard>(AuthGuard);
    })

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

});
