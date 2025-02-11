import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/StatusService";

export interface PostStatusView {
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
  setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostStatusPresenter {
  private _isLoading = false;
  private statusService: StatusService;

  private _view: PostStatusView;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.statusService = new StatusService();
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
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }
}
