import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
  setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
  setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this._userService = new UserService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this._view.setIsFollower(false);
      } else {
        this._view.setIsFollower(
          await this._userService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this._view.setFolloweeCount(
        await this._userService.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this._view.setFollowerCount(
        await this._userService.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public async actionDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    action: string,
    operationDescription: string,
    isFollower: boolean
  ) {
    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage(`${action} ${displayedUser!.name}...`, 0);

      let followerCount: number;
      let followeeCount: number;

      if (isFollower) {
        [followerCount, followeeCount] = await this._userService.follow(
          authToken!,
          displayedUser!
        );
      } else {
        [followerCount, followeeCount] = await this._userService.unfollow(
          authToken!,
          displayedUser!
        );
      }

      this._view.setIsFollower(isFollower);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${operationDescription} user because of exception: ${error}`
      );
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    this.actionDisplayedUser(
      authToken,
      displayedUser,
      "Following",
      "follow user",
      true
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.actionDisplayedUser(
      authToken,
      displayedUser,
      "Unfollowing",
      "unfollow user",
      false
    );
  }
}
