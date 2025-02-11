import { AuthToken } from "tweeter-shared";

export interface LogoutView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void
    clearLastInfoMessage: () => void;
    clearUserInfo: () => void;
}

export class LogoutPresenter {
  private _view: LogoutView;

  public constructor(view: LogoutView){
    this._view = view;
  }


    public async logOut(authToken: AuthToken) {
        this._view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.logout(authToken!);
    
          this._view.clearLastInfoMessage();
          this._view.clearUserInfo();
        } catch (error) {
            this._view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
    
      public async logout (authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
      };
}