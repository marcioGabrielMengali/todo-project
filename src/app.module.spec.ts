import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DataSource')
      .useValue({
        initialize: jest.fn(),
        destroy: jest.fn(),
        isInitialized: true,
        getRepository: jest.fn(),
      })
      .compile();

    expect(module).toBeDefined();
  });
});
