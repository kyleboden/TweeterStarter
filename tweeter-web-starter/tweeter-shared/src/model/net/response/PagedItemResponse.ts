import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<DTO> extends TweeterResponse {
  readonly items: DTO[] | null;
  readonly hasMore: boolean;
}
