import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
    setDisplayedUser: (user: User) => void;

}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private _userService: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this._userService = new UserService();
  }
  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this._userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
            this._view.setDisplayedUser(currentUser!);
        } else {
            this._view.setDisplayedUser(user);
        }
      }
    } catch (error) {
        this._view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }
}
