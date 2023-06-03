import { Resolver, Query,Mutation,Args } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { UserDto } from '../db/mysql/user.dto';
import { User } from '../db/mysql/user.entity';

@Resolver()
export class GraphQlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => String)
  async getHello(): Promise<string> {
    return await this.graphqlService.getHello();
  }
  @Query(() => String)
  async getBoard(): Promise<string> {
    return await this.graphqlService.getBoard();
  }
  @Mutation(() => String)
  async createBoard(
    @Args('body') body:UserDto
  ): Promise<string> {
    return await this.graphqlService.createBoard(body);
  }
}