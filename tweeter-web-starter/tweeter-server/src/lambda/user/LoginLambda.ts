import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const userService = new UserService(new DynamoDBFactory());
  const [userDto, authToken] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authToken,
  };
};
