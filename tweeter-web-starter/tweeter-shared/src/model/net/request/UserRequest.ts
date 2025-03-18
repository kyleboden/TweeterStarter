import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface UserRequest extends TweeterRequest {
  readonly user: UserDto;
}
