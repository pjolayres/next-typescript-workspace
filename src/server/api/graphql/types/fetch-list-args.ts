import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export default class FetchListArgs {
  @Field(_type => Int, { nullable: true })
  skip?: number;

  @Field(_type => Int, { nullable: true })
  take?: number;

  @Field({ nullable: true })
  order?: string;

  @Field({ nullable: true })
  searchText?: string;

  @Field({ nullable: true })
  searchFields?: string;
}
