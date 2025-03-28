import { AuthDynamoDBDAO } from "../dao/daoClasses/AuthDynamoDBDAO";
import { FollowsDynamoDBDAO } from "../dao/daoClasses/FollowsDynamoDBDAO";
import { StatusDynamoDBDAO } from "../dao/daoClasses/StatusDynamoDBDAO";
import { UserDynamoDBDAO } from "../dao/daoClasses/UserDynamoDBDAO";
import { AuthDAO } from "../dao/daoInterfaces/AuthDAO";
import { FollowsDAO } from "../dao/daoInterfaces/FollowsDAO";
import { StatusDAO } from "../dao/daoInterfaces/StatusDAO";
import { UserDAO } from "../dao/daoInterfaces/UserDAO";
import { Factory } from "./Factory";

export class DynamoDBFactory implements Factory {
  getFollowsDAO(): FollowsDAO {
    return new FollowsDynamoDBDAO();
  }
  getStatusDAO(): StatusDAO {
    return new StatusDynamoDBDAO();
  }
  getUserDAO(): UserDAO {
    return new UserDynamoDBDAO();
  }
  getAuthDAO(): AuthDAO {
    return new AuthDynamoDBDAO();
  }
}
