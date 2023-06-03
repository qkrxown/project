import { Test, TestingModule } from '@nestjs/testing';
import { GraphQlResolver } from './graphql.resolver';

describe('GraphQlResolver', () => {
  let resolver: GraphQlResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphQlResolver],
    }).compile();

    resolver = module.get<GraphQlResolver>(GraphQlResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
