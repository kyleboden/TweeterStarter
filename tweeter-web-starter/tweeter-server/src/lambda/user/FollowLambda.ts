import { FollowResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: UserRequest
): Promise<FollowResponse> => {
  
  const userService = new UserService(new DynamoDBFactory());
  const [followerCount, followeeCount] = await userService.follow(
    request.token,
    request.user
  );
  return {
    success: true,
    message: null,
    numFollow: followeeCount,
    follow: followerCount,
  };
};
