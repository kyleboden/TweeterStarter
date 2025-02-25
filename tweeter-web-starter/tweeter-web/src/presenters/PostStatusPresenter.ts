import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _isLoading = false;
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public async submitPost(
    authToken: AuthToken,
    currentUser: User,
    post: string
  ) {
    try {
      this._isLoading = true;
      this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${
          (error as Error).message
        }`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }
}
