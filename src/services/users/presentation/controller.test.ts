import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/service';
import { UserController } from './controller';

describe('UserController test', () => {
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('signIn test', () => {
    const userServicesignInSpyOn = jest.spyOn(userService, 'signIn');
  });
});
