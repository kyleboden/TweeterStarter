import { AuthToken } from "tweeter-shared";

import "@testing-library/jest-dom";
import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";

describe("Service", () => {
  let service = new StatusService();

  beforeEach(() => {
    service = new StatusService();
  });

  it("loads more story items from the server level", async () => {
    const authToken = new AuthToken("abc123", Date.now());
    const userAlias = "alias";
    const pageSize = 10;
    const lastItem = null;

    const [status, hasMore] = await service.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );

    //check if not null
    expect(status).not.toBeNull();
    expect(hasMore).not.toBeNull();
  });
});
