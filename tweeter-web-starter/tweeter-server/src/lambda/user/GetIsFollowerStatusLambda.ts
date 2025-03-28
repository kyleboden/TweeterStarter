import { IsFollowerRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: IsFollowerRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  const isFollower = await userService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );
  return {
    success: isFollower,
    message: null,
  };
};
