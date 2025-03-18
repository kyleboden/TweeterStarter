import { TweeterResponse } from "./TweeterResponse";

export interface NumFollowResponse extends TweeterResponse {
  readonly numFollow: number;
}
