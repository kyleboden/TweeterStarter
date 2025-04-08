import { PostStatusRequest, StatusDto, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// export const handler = async (
//   request: PostStatusRequest
// ): Promise<TweeterResponse> => {
//   const statusService = new StatusService(new DynamoDBFactory());
//   const success = await statusService.postStatus(
//     request.token,
//     request.newStatus
//   );

//   return { success: success, message: "Posted Status" };
// };

let sqsClient = new SQSClient();

async function sendMessage(body: string): Promise<void> {
  const sqs_url =
    "https://sqs.us-east-1.amazonaws.com/888577052624/PostStatusQueue";
  const messageBody = body;

  const params = {
    // DelaySeconds: 10,
    MessageBody: messageBody,
    QueueUrl: sqs_url,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
  } catch (err) {
    throw err;
  }
}

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDBFactory());
  const success = await statusService.postStatus(
    request.token,
    request.newStatus
  );

  const jsonStatus: string = JSON.stringify(request.newStatus);
  await sendMessage(jsonStatus);

  return { success: success, message: "Posted Status" };
};
