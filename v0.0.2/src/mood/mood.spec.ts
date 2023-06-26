import { Test, TestingModule } from '@nestjs/testing';
import { Mood } from 'src/db/mysql/mood.entity';


describe('Mood', () => {
  let provider: Mood;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mood],
    }).compile();

    provider = module.get<Mood>(Mood);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
