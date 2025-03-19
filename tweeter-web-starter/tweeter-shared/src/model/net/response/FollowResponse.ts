import { NumFollowResponse } from "./NumFollowResponse";

export interface FollowResponse extends NumFollowResponse {
  readonly follow: number;
}
