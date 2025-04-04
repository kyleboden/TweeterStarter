import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../../src/presenters/PostStatusPresenter";
import {
  anything,
  deepEqual,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../../src/model/service/StatusService";
// import { StatusService } from "../../../src/model/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("Kyle", "Boden", "kyleboden", "abc.com");
  const post = "I'm graduating this semester!";
  const status = new Status(post, currentUser, Date.now());

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView
    );

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockUserServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockUserServiceInstance
    );
  });

  it("tells the view to display a posting status message.", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, post);
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, post);

    verify(
      mockStatusService.postStatus(
        authToken,
        deepEqual(new Status(post, currentUser, anything()))
      )
    ).once();
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message when post Status is successful.", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, post);
    verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).once();

    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when logout fails.", async () => {
    const error = new Error("An error occured");
    when(
      mockStatusService.postStatus(
        authToken,
        deepEqual(new Status(post, currentUser, anything()))
      )
    ).thenThrow(error);

    await postStatusPresenter.submitPost(authToken, currentUser, post);

    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        "Failed to post the status because of exception: An error occured"
      )
    ).once();
    verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
