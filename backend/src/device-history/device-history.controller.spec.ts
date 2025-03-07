import { Test, TestingModule } from '@nestjs/testing';
import { DeviceHistoryController } from './device-history.controller';

describe('DeviceHistoryController', () => {
  let controller: DeviceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceHistoryController],
    }).compile();

    controller = module.get<DeviceHistoryController>(DeviceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
