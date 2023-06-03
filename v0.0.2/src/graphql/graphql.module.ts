import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig , ApolloDriver} from '@nestjs/apollo';
import { GraphqlService } from './graphql.service';
import { GraphQlResolver } from './graphql.resolver';
import { User } from '../db/mysql/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile : 'src/graphql/schema/schema.gql'
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [GraphQlResolver , GraphqlService]
})
export class GraphqlModule {}