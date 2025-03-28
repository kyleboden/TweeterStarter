import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: TweeterRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
