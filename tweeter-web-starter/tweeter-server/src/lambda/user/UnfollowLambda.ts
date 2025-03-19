import { FollowResponse, UserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserRequest
): Promise<FollowResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.unfollow(
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
