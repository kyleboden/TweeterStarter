import { NumFollowResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: UserRequest
): Promise<NumFollowResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  const followeeCount = await userService.getFolloweeCount(
    request.token,
    request.user
  );
  return {
    success: true,
    message: null,
    numFollow: followeeCount,
  };
};
