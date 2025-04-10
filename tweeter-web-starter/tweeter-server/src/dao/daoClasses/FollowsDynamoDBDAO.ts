import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, Select } from "@aws-sdk/client-dynamodb";
import { FollowEntity } from "../entity/FollowEntity";
import { DataPage } from "../entity/DataPage";
import { FollowsDAO } from "../daoInterfaces/FollowsDAO";

export class FollowsDynamoDBDAO implements FollowsDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerNameAttr = "follower_name";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeNameAttr = "followee_name";
  readonly followeeHandleAttr = "followee_handle";

  readonly userTableName = "users";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFollower(follower: FollowEntity): Promise<void> {
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
    follower: FollowEntity,
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

  public async getFollower(
    follower: FollowEntity
  ): Promise<FollowEntity | undefined> {
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

  public async deleteFollower(follower: FollowEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowItem(follower),
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFollowItem(follower: FollowEntity) {
    return {
      [this.followerHandleAttr]: follower.followerHandle,
      [this.followeeHandleAttr]: follower.followeeHandle,
    };
  }

  public async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<FollowEntity>> {
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
  ): Promise<DataPage<FollowEntity>> {
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

  // public async getAllFollowers(
  //   followeeHandle: string
  // ): Promise<DataPage<FollowEntity>> {
  //   const params = {
  //     KeyConditionExpression: this.followeeHandleAttr + " = :fol",
  //     ExpressionAttributeValues: {
  //       ":fol": followeeHandle,
  //     },
  //     TableName: this.tableName,
  //     IndexName: this.indexName,
  //   };

  //   return await this.executeFollowQuery(params);
  // }

  // public async getAllFollowees(
  //   followerHandle: string
  // ): Promise<DataPage<FollowEntity>> {
  //   const params = {
  //     KeyConditionExpression: this.followerHandleAttr + " = :f",
  //     ExpressionAttributeValues: {
  //       ":f": followerHandle,
  //     },
  //     TableName: this.tableName,
  //   };

  //   return await this.executeFollowQuery(params);
  // }

  private async executeFollowQuery(
    params: any
  ): Promise<DataPage<FollowEntity>> {
    const items: FollowEntity[] = [];
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

    return new DataPage<FollowEntity>(items, hasMorePages);
  }

  // public async getFolloweeCount(followerHandle: string): Promise<number> {
  //   const params = {
  //     KeyConditionExpression: this.followerHandleAttr + " = :f",
  //     ExpressionAttributeValues: {
  //       ":f": followerHandle,
  //     },
  //     TableName: this.tableName,
  //     Select: Select.COUNT, // ✅ use the enum instead of plain string
  //   };

  //   const data = await this.client.send(new QueryCommand(params));
  //   return data.Count ?? 0;
  // }

  // public async getFollowerCount(followeeHandle: string): Promise<number> {
  //   const params = {
  //     KeyConditionExpression: this.followeeHandleAttr + " = :f",
  //     ExpressionAttributeValues: {
  //       ":f": followeeHandle,
  //     },
  //     TableName: this.tableName,
  //     Select: Select.COUNT, // ✅ use the enum instead of plain string
  //   };

  //   const data = await this.client.send(new QueryCommand(params));
  //   return data.Count ?? 0;
  // }

  // async getFolloweeCount(userHandle: string): Promise<number> {
  //   const data = await this.client.send(
  //     new GetCommand({
  //       TableName: this.userTableName,
  //       Key: [this.al],
  //       ProjectionExpression: "followee_count",
  //     })
  //   );

  //   return data.Item?.followee_count ?? 0;
  // }

  // async getFollowerCount(userHandle: string): Promise<number> {
  //   const data = await this.client.send(
  //     new GetCommand({
  //       TableName: this.userTableName,
  //       Key: { userHandle },
  //       ProjectionExpression: "follower_count",
  //     })
  //   );

  //   return data.Item?.follower_count ?? 0;
  // }

  // async decrementFollowCounts(followerHandle: string, followeeHandle: string): Promise<void> {
  //   await this.client.send(
  //     new UpdateCommand({
  //       TableName: this.userTableName,
  //       Key: { userHandle: followerHandle },
  //       UpdateExpression: "ADD followee_count :dec",
  //       ExpressionAttributeValues: { ":dec": -1 },
  //     })
  //   );

  //   await this.client.send(
  //     new UpdateCommand({
  //       TableName: this.userTableName,
  //       Key: { userHandle: followeeHandle },
  //       UpdateExpression: "ADD follower_count :dec",
  //       ExpressionAttributeValues: { ":dec": -1 },
  //     })
  //   );
  // }

  // async incrementFollowCounts(followerHandle: string, followeeHandle: string): Promise<void> {
  //   // Increment followee_count for the follower
  //   await this.client.send(
  //     new UpdateCommand({
  //       TableName: this.userTableName,
  //       Key: { userHandle: followerHandle },
  //       UpdateExpression: "ADD followee_count :inc",
  //       ExpressionAttributeValues: { ":inc": 1 },
  //     })
  //   );

  //   // Increment follower_count for the followee
  //   await this.client.send(
  //     new UpdateCommand({
  //       TableName: this.userTableName,
  //       Key: { userHandle: followeeHandle },
  //       UpdateExpression: "ADD follower_count :inc",
  //       ExpressionAttributeValues: { ":inc": 1 },
  //     })
  //   );
  // }
}
