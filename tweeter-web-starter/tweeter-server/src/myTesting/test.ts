import { StatusDto, UserDto } from "tweeter-shared";
import { AuthDynamoDBDAO } from "../dao/daoClasses/AuthDynamoDBDAO";
import { StoryDynamoDBDAO } from "../dao/daoClasses/StoryDynamoDBDAO";
import { DynamoDBFactory } from "../factory/DynamoDBFactory";
import { StatusService } from "../model/service/StatusService";
import { FollowEntity } from "../dao/entity/FollowEntity";
import { FollowsDynamoDBDAO } from "../dao/daoClasses/FollowsDynamoDBDAO";
import { ImageS3DAO } from "../dao/daoClasses/ImageS3DAO";
import { UserDynamoDBDAO } from "../dao/daoClasses/UserDynamoDBDAO";
import { UserService } from "../model/service/UserService";

//  npx ts-node src/myTesting/test.ts

const authDao = new AuthDynamoDBDAO();
const storyDao = new StoryDynamoDBDAO();
const followDao = new FollowsDynamoDBDAO();
const imageDao = new ImageS3DAO();
const userDao = new UserDynamoDBDAO();

// authDao.deleteAuth("95d571f5-96c9-4144-bcb4-49bc06db29aa"); // deleteAuth works

// async function main() {
//   const statusService = new StatusService(new DynamoDBFactory());
//   // const res = await statusService.loadMoreStoryItems("token", "k", 10, null);
//   // console.log("res: ", res);

//   const userDto: UserDto = {
//     firstName: "b",
//     lastName: "b",
//     alias: "b",
//     imageUrl: "imageurl",
//   };

//   const statusDto: StatusDto = {
//     post: "test post",
//     user: userDto,
//     timestamp: 1234213451,
//   };
//   const res = await statusService.postStatus("token", statusDto);
//   console.log("res: ", res);
// }

async function main() {
  // const follower: FollowEntity = {
  //   followerName: "a",
  //   followerHandle: "@a",
  //   followeeName: "b",
  //   followeeHandle: "@b",
  // };
  // await followDao.deleteFollower(follower);

  // let userService = new UserService(new DynamoDBFactory());
  // let alias = "a";
  // let fileName = `${alias}_Image`;
  // let imageUrl = await imageDao.getImage(fileName);

  // const user1Dto: UserDto = {
  //   firstName: "a",
  //   lastName: "a",
  //   alias: "@a",
  //   imageUrl: imageUrl,
  // };
  // const tokena = "$2b$10$yvQ/Hx6t.FQRKnW69bsyw.EAaCrf5n75pd0QPCAfNwOrDsoqegWYO";

  // alias = "b";
  // fileName = `${alias}_Image`;
  // imageUrl = await imageDao.getImage(fileName);
  // const user2: UserDto = {
  //   firstName: "b",
  //   lastName: "b",
  //   alias: "@b",
  //   imageUrl: imageUrl,
  // };
  // const tokenb = "$2b$10$QH4fQeEcm.6cKVJFHKQVeO1/t5E.NeP982IaBMtw9HjwN27lgiF5q";

  // await userService.follow(tokena, user2);

  const followers = await followDao.getAllFollowers("@ClintEastwood");
  console.log("Number of Followers: ", followers.values.length);

  const followees = await followDao.getAllFollowees("@FredFlintstone");
  console.log("Number of Followees: ", followees.values.length);
}
main().catch(console.error);

// console.log(storyDao.getPageOfStories("k", 10, 1743625556502));
