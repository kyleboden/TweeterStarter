import { StatusDto } from "tweeter-shared";
import { DynamoDBFactory } from "../../factory/DynamoDBFactory";
import { StatusService } from "../../model/service/StatusService";

export const handler = async function (event: any) {
  const statusService = new StatusService(new DynamoDBFactory());
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];

    const bodyObject: { followerList: string[]; statusDto: StatusDto } =
      JSON.parse(body);
    const followerList = bodyObject.followerList;
    const statusDto = bodyObject.statusDto;

    await statusService.updateFeed(followerList, statusDto);
  }
  return null;
};
