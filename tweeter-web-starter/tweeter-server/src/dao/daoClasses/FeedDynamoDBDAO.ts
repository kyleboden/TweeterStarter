import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../entity/DataPage";
import { FeedDAO } from "../daoInterfaces/FeedDAO";
import { StatusDto } from "tweeter-shared";

export class FeedDynamoDBDAO implements FeedDAO {
  readonly tableName = "feed";

  readonly aliasAttr = "alias";
  readonly timeStampAttr = "time_stamp";
  readonly statusAttr = "status";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFeed(
    status: StatusDto,
    followerAlias: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: followerAlias,
        [this.timeStampAttr]: status.timestamp.toString(),
        [this.statusAttr]: JSON.stringify(status),
      },
    };
    // await this.client.send(new PutCommand(params));
    console.log("Putting feed into DynamoDB:", JSON.stringify(params, null, 2)); // Debugging
    try {
      await this.client.send(new PutCommand(params));
      console.log("Put item successfully!");
    } catch (error) {
      console.error("Error putting item:", error);
    }
  }

  public async putFeedBatch(
    status: StatusDto,
    followerAliasList: string[]
  ): Promise<void> {
    if (followerAliasList.length === 0) {
      console.log("No followers to update feed for.");
      return;
    }

    const items = this.createFeedItems(status, followerAliasList);
    const batchedRequests = this.chunkArray(items, 25).map((batch) => ({
      RequestItems: {
        [this.tableName]: batch.map((item) => ({
          PutRequest: { Item: item },
        })),
      },
    }));

    for (const params of batchedRequests) {
      try {
        const response = await this.client.send(new BatchWriteCommand(params));
        await this.retryUnprocessedItems(response, params);
      } catch (err) {
        console.error(`Batch write failed with error:\n`, err);
        throw err;
      }
    }
  }

  private createFeedItems(status: StatusDto, followerAliasList: string[]) {
    return followerAliasList.map((followerAlias) => ({
      [this.aliasAttr]: followerAlias,
      [this.timeStampAttr]: status.timestamp.toString(),
      [this.statusAttr]: JSON.stringify(status),
    }));
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  private async retryUnprocessedItems(
    response: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      response.UnprocessedItems &&
      Object.keys(response.UnprocessedItems).length > 0
    ) {
      attempts++;
      console.log(
        `Retrying ${
          Object.keys(response.UnprocessedItems).length
        } unprocessed items (Attempt ${attempts})`
      );

      if (attempts > 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay + 100, 1000);
      }

      params.RequestItems = response.UnprocessedItems;
      response = await this.client.send(new BatchWriteCommand(params));
    }
  }

  private async executeFeedQuery(params: any): Promise<DataPage<StatusDto>> {
    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      items.push(JSON.parse(item["status"].S!));
    });
    return new DataPage<StatusDto>(items, hasMorePages);
  }

  public async getPageOfFeeds(
    alias: string,
    pageSize: number,
    timestamp: number | undefined
  ): Promise<DataPage<StatusDto>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.aliasAttr} = :s`,
      ExpressionAttributeValues: {
        ":s": { S: alias },
      },
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey:
        timestamp === undefined
          ? undefined
          : {
              [this.aliasAttr]: { S: alias },
              [this.timeStampAttr]: { S: timestamp.toString() },
            },
    };
    console.log("printing params in getPageOfFeeds: ", params);

    const data = await this.executeFeedQuery(params);
    return data;
  }
}
