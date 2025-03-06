import { Test, TestingModule } from '@nestjs/testing';
import { DeviceModelController } from './device-model.controller';

describe('DeviceModelController', () => {
  let controller: DeviceModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceModelController],
    }).compile();

    controller = module.get<DeviceModelController>(DeviceModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
