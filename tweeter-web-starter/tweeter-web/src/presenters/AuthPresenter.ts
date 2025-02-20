import { AuthToken, User } from "tweeter-shared";
import { AuthView, Presenter, View } from "./Presenter";

export abstract class AuthPresenter<T extends AuthView> extends Presenter<T> {
  public async doAuth(
    rememberMe: boolean,
    serviceCall: () => Promise<[User, AuthToken]>,
    navigateCall: () => void,
    operationDescription: string
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await serviceCall();

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      navigateCall();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${operationDescription} user in because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }
}
