import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken!);

      this._view.clearLastInfoMessage();
      this._view.clearUserInfo();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
