import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { AuthDAO } from "../daoInterfaces/AuthDAO";
import { AuthEntity } from "../entity/AuthEntity";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

export class AuthDynamoDBDAO implements AuthDAO {
  readonly tableName = "authTokens";

  readonly aliasAttr = "alias";
  readonly tokenAttr = "token";
  readonly timestampAttr = "time_stamp";
  readonly timeout = 6000000;

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
      Key: {
        [this.tokenAttr]: token,
      },
    };
    console.log("params: ", params, "\n");

    console.log("token", token);
    await this.client.send(new DeleteCommand(params));
  }

  public async updateAuth(token: string, timestamp: number): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.tokenAttr]: token,
      },
      ExpressionAttributeValues: {
        ":timestamp": timestamp,
      },
      UpdateExpression: "SET " + this.timestampAttr + " = :timestamp",
    };
    await this.client.send(new UpdateCommand(params));
  }

  public async checkAuth(token: string): Promise<boolean> {
    await this.deleteExpiredAuthtokens();
    const authEntity: AuthEntity | undefined = await this.getAuth(token);
    if (authEntity == undefined) {
      return false;
    }
    await this.updateAuth(token, Date.now());
    return true;
  }

  private async deleteExpiredAuthtokens(): Promise<void> {
    const authEntities: AuthEntity[] = await this.getAllAuthTokens();

    for (const entity of authEntities) {
      if (Date.now() - entity.timestamp > this.timeout) {
        await this.deleteAuth(entity.token);
      }
    }
  }

  private async getAllAuthTokens(): Promise<AuthEntity[]> {
    const params = {
      TableName: this.tableName,
    };

    const output = await this.client.send(new ScanCommand(params));

    return (
      output.Items?.map((item) => {
        const unmarshalled = unmarshall(item);
        return {
          alias: unmarshalled[this.aliasAttr],
          token: unmarshalled[this.tokenAttr],
          timestamp: Number(unmarshalled[this.timestampAttr]),
        };
      }) ?? []
    );
  }
}
