import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { StatusEntity } from "../entity/StoryEntity";
import { DataPage } from "../entity/DataPage";
import { StoryDAO } from "../daoInterfaces/StoryDAO";

export class StoryDynamoDBDAO implements StoryDAO {
  readonly tableName = "story";
  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putStory(story: StatusEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: story.alias,
        [this.timestampAttr]: story.timestamp,
        [this.postAttr]: story.post,
      },
    };
    console.log(
      "Putting story into DynamoDB:",
      JSON.stringify(params, null, 2)
    ); // Debugging
    try {
      await this.client.send(new PutCommand(params));
      console.log("Put item successfully!");
    } catch (error) {
      console.error("Error putting item:", error);
    }
  }

  public async getPageOfStories(
    alias: string,
    pageSize: number,
    timestamp: number | undefined
  ): Promise<DataPage<StatusEntity>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.aliasAttr} = :s`,
      ExpressionAttributeValues: {
        ":s": { S: alias }, // ✅ Wrap alias as an AWS string attribute
      },
      Limit: pageSize,
      ScanIndexForward: false, // ✅ Ensures most recent stories appear first
      ExclusiveStartKey:
        timestamp === undefined
          ? undefined
          : {
              [this.aliasAttr]: { S: alias }, // ✅ Wrap alias as an AWS string
              [this.timestampAttr]: { N: timestamp.toString() }, // ✅ Convert number to AWS number
            },
    };

    // console.log("params in getPageofStories: ", params);

    return await this.executeStatusQuery(params);
  }

  private async executeStatusQuery(
    params: any
  ): Promise<DataPage<StatusEntity>> {
    const items: StatusEntity[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) =>
      items.push({
        alias: item[this.aliasAttr]?.S ?? "", // Extracts string safely
        timestamp: item[this.timestampAttr]?.N
          ? Number(item[this.timestampAttr].N)
          : 0, // Extracts number safely
        post: item[this.postAttr]?.S ?? "", // Extracts string safely
      })
    );

    return new DataPage<StatusEntity>(items, hasMorePages);
  }
}
