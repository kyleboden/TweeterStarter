import { UserService } from "../model/UserService";
import { AuthView, Presenter } from "./Presenter";

// export interface LoginView extends AuthView {}

export class LoginPresenter extends Presenter<AuthView> {
  private _userService: UserService;

  public constructor(view: AuthView) {
    super(view);
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
