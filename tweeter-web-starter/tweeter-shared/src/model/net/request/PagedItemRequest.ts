import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<DTO> extends TweeterRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: DTO | null;
}
