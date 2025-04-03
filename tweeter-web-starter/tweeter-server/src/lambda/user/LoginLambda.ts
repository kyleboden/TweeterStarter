import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  const userService = new UserService(new DynamoDBFactory());

  try {
    const [userDto, authToken] = await userService.login(
      request.alias,
      request.password
    );
    return {
      success: true,
      message: null,
      user: userDto,
      token: authToken.token,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occured",
      user: null,
      token: null,
    };
  }
};
