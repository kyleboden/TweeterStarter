import { NavigateFunction } from "react-router-dom";
import { User, AuthToken, FakeData } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;

  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: NavigateFunction;
}

export class LoginPresenter {
  private _view: LoginView;
  private _userService: UserService;

  public constructor(view: LoginView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    ogURL: string
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this._userService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!ogURL) {
        this._view.navigate(ogURL);
      } else {
        this._view.navigate("/");
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }
}
