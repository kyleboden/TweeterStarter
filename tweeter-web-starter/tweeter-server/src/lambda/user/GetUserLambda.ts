import { GetUserRequest, GetUserResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  const userDto: UserDto | null = await userService.getUser(
    request.token,
    request.alias
  );
  return {
    success: true,
    message: null,
    user: userDto,
  };
};
