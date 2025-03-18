import { NumFollowResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserRequest
): Promise<NumFollowResponse> => {
  const userService = new UserService();
  const followerCount = await userService.getFollowerCount(
    request.token,
    request.user
  );
  return {
    success: true,
    message: null,
    numFollow: followerCount,
  };
};
