import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<DTO> extends TweeterRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: DTO | null;
}
