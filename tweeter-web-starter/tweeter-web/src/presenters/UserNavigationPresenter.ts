import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private _userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this._userService = new UserService();
  }
  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const user = await this._userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._view.setDisplayedUser(currentUser!);
        } else {
          this._view.setDisplayedUser(user);
        }
      }
    }, "get user");

    //   try {
    //     const alias = this.extractAlias(event.target.toString());

    //     const user = await this._userService.getUser(authToken!, alias);

    //     if (!!user) {
    //       if (currentUser!.equals(user)) {
    //         this._view.setDisplayedUser(currentUser!);
    //       } else {
    //         this._view.setDisplayedUser(user);
    //       }
    //     }
    //   } catch (error) {
    //     this._view.displayErrorMessage(
    //       `Failed to get user because of exception: ${error}`
    //     );
    //   }
  }
}
