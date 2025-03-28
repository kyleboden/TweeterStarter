import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follower } from "../entity/Follower";
import { DataPage } from "../entity/DataPage";
import { FollowsDAO } from "../daoInterfaces/FollowsDAO";

export class FollowsDynamoDBDAO implements FollowsDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerNameAttr = "follower_name";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeNameAttr = "followee_name";
  readonly followeeHandleAttr = "followee_handle";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followeeHandleAttr]: follower.followeeHandle,
        [this.followeeNameAttr]: follower.followeeName,
        [this.followerHandleAttr]: follower.followerHandle,
        [this.followerNameAttr]: follower.followerName,
      },
    };
    console.log(
      "Putting follower into DynamoDB:",
      JSON.stringify(params, null, 2)
    ); // Debugging
    try {
      await this.client.send(new PutCommand(params));
      console.log("Put item successfully!");
    } catch (error) {
      console.error("Error putting item:", error);
    }
  }

  public async updateFollower(
    follower: Follower,
    newFollowerName: string,
    newFolloweeName: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follower),
      ExpressionAttributeValues: {
        ":newFollowerName": newFollowerName,
        ":newFolloweeName": newFolloweeName,
      },
      UpdateExpression:
        "SET " +
        this.followerNameAttr +
        " = :newFollowerName, " +
        this.followeeNameAttr +
        " = :newFolloweeName, ",
    };
    await this.client.send(new UpdateCommand(params));
  }

  public async getFollower(follower: Follower): Promise<Follower | undefined> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follower),
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          followerName: output.Item[this.followerHandleAttr],
          followerHandle: output.Item[this.followerHandleAttr],
          followeeName: output.Item[this.followeeHandleAttr],
          followeeHandle: output.Item[this.followeeHandleAttr],
        };
  }

  public async deleteFollower(follower: Follower): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follower),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFollowItem(follower: Follower) {
    return {
      [this.followerHandleAttr]: follower.followerHandle,
      [this.followeeHandleAttr]: follower.followeeHandle,
    };
  }

  public async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follower>> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: followerHandle,
              [this.followeeHandleAttr]: lastFolloweeHandle,
            },
    };

    return await this.executeFollowQuery(params);
  }

  public async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follower>> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + " = :fol",
      ExpressionAttributeValues: {
        ":fol": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: lastFollowerHandle,
              [this.followeeHandleAttr]: followeeHandle,
            },
    };

    return await this.executeFollowQuery(params);
  }

  private async executeFollowQuery(params: any): Promise<DataPage<Follower>> {
    const items: Follower[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) =>
      items.push({
        followerName: item[this.followerNameAttr],
        followerHandle: item[this.followerHandleAttr],
        followeeName: item[this.followeeNameAttr],
        followeeHandle: item[this.followeeHandleAttr],
      })
    );

    return new DataPage<Follower>(items, hasMorePages);
  }
}
