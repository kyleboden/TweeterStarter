import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface LogoutView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
}

export class LogoutPresenter {
  private _view: LogoutView;
  private userService: UserService;

  public constructor(view: LogoutView) {
    this._view = view;
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
