import { PostStatusRequest, StatusDto, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDBFactory());
  const success = await statusService.postStatus(
    request.token,
    request.newStatus
  );

  return { success: success, message: "Posted Status" };
};
