import { AuthDynamoDBDAO } from "../dao/daoClasses/AuthDynamoDBDAO";
import { StoryDynamoDBDAO } from "../dao/daoClasses/StoryDynamoDBDAO";
import { DynamoDBFactory } from "../factory/DynamoDBFactory";
import { StatusService } from "../model/service/StatusService";

const authDao = new AuthDynamoDBDAO();
const storyDao = new StoryDynamoDBDAO();

// authDao.deleteAuth("95d571f5-96c9-4144-bcb4-49bc06db29aa"); // deleteAuth works

async function main() {
  const statusService = new StatusService(new DynamoDBFactory());
  const res = await statusService.loadMoreStoryItems("token", "k", 10, null);
  console.log("res: ", res);
}

main().catch(console.error);

// console.log(storyDao.getPageOfStories("k", 10, 1743625556502));
