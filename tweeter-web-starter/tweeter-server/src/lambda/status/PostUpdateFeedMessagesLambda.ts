import { StatusDto, UserDto } from "tweeter-shared";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { StatusService } from "../../model/service/StatusService";
import { FollowService } from "../../model/service/FollowService";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(body: string): Promise<void> {
  const sqs_url =
    "https://sqs.us-east-1.amazonaws.com/888577052624/PostUpdateFeedQueue";
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

export const handler = async function (event: any) {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    // TODO: Add code to print message body to the log.
    const statusDto: StatusDto = JSON.parse(body);
    const followService = new FollowService(new DynamoDBFactory());
    // for loop to send a batch of 100 to the SQS Update Feed Queue
    // const hasMore: boolean = true;
    // while(hasMore) {

    //     // send to SQS UpdateFeedQueue()
    //     // const body: string = statusService.getBatchOf100();
    //     const token: string;
    //     const userAlias: string;
    //     const lastItem: UserDto | null;
    //     followService.loadMoreFollowers(token, userAlias, 100, lastItem)

    //     const jsonStatus: string = JSON.stringify(body);
    //     await sendMessage(body)

    // }

    let hasMore: boolean = true;
    let lastUserAlias: string | undefined = undefined;
    const userAlias = statusDto.user.alias;
    while (hasMore) {
      // send to SQS UpdateFeedQueue()
      const followerList: string[] = await followService.getBatch(
        userAlias,
        2,
        lastUserAlias
      );
      //   lastUserAlias = body[-1];
      lastUserAlias = followerList[followerList.length - 1];

      console.log(
        "lastUserALias in PostUpdateFeedMessagesLambda: ",
        lastUserAlias
      );

      if (followerList.length < 2) {
        hasMore = false;
      }

      const followerStatusBody = {
        followerList: followerList,
        statusDto: statusDto,
      };
      const jsonStatus: string = JSON.stringify(followerStatusBody);
      await sendMessage(jsonStatus);
    }
  }
  return null;
};
