import { PostStatusRequest, StatusDto, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  const success = await statusService.postStatus(
    request.token,
    request.newStatus
  );

  return { success: success, message: "Posted Status" };
};
