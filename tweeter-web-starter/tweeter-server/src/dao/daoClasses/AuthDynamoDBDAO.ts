import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthDAO } from "../daoInterfaces/AuthDAO";
import { AuthEntity } from "../entity/AuthEntity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthDynamoDBDAO implements AuthDAO {
  readonly tableName = "authTokens";

  readonly aliasAttr = "alias";
  readonly tokenAttr = "password";
  readonly timestampAttr = "time_stamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putAuth(authToken: AuthEntity): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.aliasAttr]: authToken.alias,
        [this.tokenAttr]: authToken.token,
        [this.timestampAttr]: authToken.timestamp,
      },
    };
    console.log(
      "Putting authToken into DynamoDB:",
      JSON.stringify(params, null, 2)
    ); // Debugging
    try {
      await this.client.send(new PutCommand(params));
      console.log("Put item successfully!");
    } catch (error) {
      console.error("Error putting item:", error);
    }
  }

  public async getAuth(token: string): Promise<AuthEntity | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttr]: token,
      },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : {
          alias: output.Item[this.aliasAttr],
          token: output.Item[this.tokenAttr],
          timestamp: output.Item[this.timestampAttr],
        };
  }
  public async deleteAuth(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.tokenAttr]: token },
    };
    await this.client.send(new DeleteCommand(params));
  }

  public async updateAuth(token: string, timestamp: number): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.tokenAttr]: token },
      ExpressionAttributeValues: {
        ":timestamp": timestamp,
      },
      UpdateExpression: "SET " + this.timestampAttr + " = :timestamp, ",
    };
    await this.client.send(new UpdateCommand(params));
  }
}
