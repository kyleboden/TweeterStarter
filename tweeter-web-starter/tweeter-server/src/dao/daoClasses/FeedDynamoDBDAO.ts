import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { StatusEntity } from "../entity/StatusEntity";
import { DataPage } from "../entity/DataPage";
import { FeedDAO } from "../daoInterfaces/FeedDAO";

export class FeedDynamoDBDAO implements FeedDAO {
  readonly tableName = "feed";
  readonly aliasAttr = "alias";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFeed(feed: StatusEntity): Promise<void> {
    
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: feed.alias,
        [this.timestampAttr]: feed.timestamp.toString(),
        [this.postAttr]: feed.post,
      },
    };
    console.log("Putting feed into DynamoDB:", JSON.stringify(params, null, 2)); // Debugging
    try {
      await this.client.send(new PutCommand(params));
      console.log("Put item successfully!");
    } catch (error) {
      console.error("Error putting item:", error);
    }
  }

  public async getPageOfFeeds(
    alias: string,
    pageSize: number,
    timestamp: number | undefined
  ): Promise<DataPage<StatusEntity>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.aliasAttr} = :feed`,
      ExpressionAttributeValues: {
        ":feed": { S: alias },
      },
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        timestamp === undefined
          ? undefined
          : {
              [this.aliasAttr]: { S: alias },
              [this.timestampAttr]: { N: timestamp.toString() },
            },
    };

    // console.log("params in getPageOfFeeds: ", params);

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
        timestamp: item[this.timestampAttr]?.S
          ? Number(item[this.timestampAttr].S)
          : 0, // Extracts number safely
        post: item[this.postAttr]?.S ?? "", // Extracts string safely
      })
    );

    return new DataPage<StatusEntity>(items, hasMorePages);
  }
}
