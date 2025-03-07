import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStatusController } from './device-status.controller';

describe('DeviceStatusController', () => {
  let controller: DeviceStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceStatusController],
    }).compile();

    controller = module.get<DeviceStatusController>(DeviceStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
