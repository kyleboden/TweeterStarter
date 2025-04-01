import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
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
          // userImageBytes: output.Item[this.userImageBytesAttr],
          // imageFileExtension: output.Item[this.imageFileExtensionAttr],
        };
  }
}
