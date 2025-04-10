import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDAO } from "../daoInterfaces/UserDAO";
import { UserEntity } from "../entity/UserEntity";

export class UserDynamoDBDAO implements UserDAO {
  readonly tableName = "users";

  readonly aliasAttr = "alias";
  readonly passwordAttr = "password";
  readonly firstNameAttr = "firstName";
  readonly lastNameAttr = "lastName";
  readonly userImageBytesAttr = "userImageBytes";
  readonly imageFileExtensionAttr = "imageFileExtension";
  readonly followerCountAttr = "follower_count";
  readonly followeeCountAttr = "followee_count";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putUser(user: UserEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: user.alias,
        [this.passwordAttr]: user.password,
        [this.firstNameAttr]: user.firstName,
        [this.lastNameAttr]: user.lastName,
        // [this.userImageBytesAttr]: user.userImageBytes,
        // [this.imageFileExtensionAttr]: user.imageFileExtension,
      },
    };
    console.log("Putting user into DynamoDB:", JSON.stringify(params, null, 2)); // Debugging
    try {
      await this.client.send(new PutCommand(params));
      console.log("Put item successfully!");
    } catch (error) {
      console.error("Error putting item:", error);
    }
  }

  public async getUser(alias: string): Promise<UserEntity | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.aliasAttr]: alias,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          alias: output.Item[this.aliasAttr],
          password: output.Item[this.passwordAttr],
          firstName: output.Item[this.firstNameAttr],
          lastName: output.Item[this.lastNameAttr],
          followeeCount: output.Item[this.followeeCountAttr],
          followerCount: output.Item[this.followerCountAttr],
        };
  }

  async getFolloweeCount(userHandle: string): Promise<number> {
    const data = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: userHandle },
        ProjectionExpression: "followee_count",
      })
    );

    return data.Item?.followee_count ?? 0;
  }

  async getFollowerCount(userHandle: string): Promise<number> {
    const data = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: userHandle },
        ProjectionExpression: "follower_count",
      })
    );

    return data.Item?.follower_count ?? 0;
  }

  public async decrementFollowCounts(
    followerHandle: string,
    followeeHandle: string
  ): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: followerHandle },
        UpdateExpression: "ADD followee_count :dec",
        ExpressionAttributeValues: { ":dec": -1 },
      })
    );

    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: followeeHandle },
        UpdateExpression: "ADD follower_count :dec",
        ExpressionAttributeValues: { ":dec": -1 },
      })
    );
  }

  public async incrementFollowCounts(
    followerHandle: string,
    followeeHandle: string
  ): Promise<void> {
    // Increment followee_count for the follower
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: followerHandle },
        UpdateExpression: "ADD followee_count :inc",
        ExpressionAttributeValues: { ":inc": 1 },
      })
    );

    // Increment follower_count for the followee
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: followeeHandle },
        UpdateExpression: "ADD follower_count :inc",
        ExpressionAttributeValues: { ":inc": 1 },
      })
    );
  }
}
