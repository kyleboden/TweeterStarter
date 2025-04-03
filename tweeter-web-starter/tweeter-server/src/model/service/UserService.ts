import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { UserDAO } from "../../dao/daoInterfaces/UserDAO";
import { AuthDAO } from "../../dao/daoInterfaces/AuthDAO";
import { UserEntity } from "../../dao/entity/UserEntity";
import { AuthEntity } from "../../dao/entity/AuthEntity";
import { ImageDAO } from "../../dao/daoInterfaces/ImageDAO";
import bcrypt from "bcryptjs";
import { FollowsDAO } from "../../dao/daoInterfaces/FollowsDAO";
import { FollowEntity } from "../../dao/entity/FollowEntity";

export class UserService {
  private userDao: UserDAO;
  private authDao: AuthDAO;
  private imageDao: ImageDAO;
  private followsDao: FollowsDAO;
  private authDAO: AuthDAO;

  constructor(factory: Factory) {
    this.userDao = factory.getUserDAO();
    this.authDao = factory.getAuthDAO();
    this.imageDao = factory.getImageDAO();
    this.followsDao = factory.getFollowsDAO();
    this.authDAO = factory.getAuthDAO();
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const followEntity: FollowEntity = {
      followerName: user.firstName,
      followerHandle: user.alias,
      followeeName: selectedUser.firstName,
      followeeHandle: selectedUser.alias,
    };
    const follower = await this.followsDao.getFollower(followEntity);

    if (!follower) {
      return false;
    } else {
      return true;
    }
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const followees = await this.followsDao.getAllFollowees(user.alias);
    return followees.values.length;
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const followers = await this.followsDao.getAllFollowers(user.alias);
    return followers.values.length;
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const authToken = await this.authDao.getAuth(token);
    const followerAlias = authToken!.alias;
    const follower = await this.userDao.getUser(followerAlias);

    const followEntity: FollowEntity = {
      followerName: follower!.firstName,
      followerHandle: followerAlias,
      followeeName: userToFollow.firstName,
      followeeHandle: userToFollow.alias,
    };
    this.followsDao.putFollower(followEntity);

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const authToken = await this.authDao.getAuth(token);
    const followerAlias = authToken!.alias;
    const follower = await this.userDao.getUser(followerAlias);

    const followEntity: FollowEntity = {
      followerName: follower!.firstName,
      followerHandle: followerAlias,
      followeeName: userToUnfollow.firstName,
      followeeHandle: userToUnfollow.alias,
    };
    this.followsDao.deleteFollower(followEntity);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const userEntity: UserEntity | undefined = await this.userDao.getUser(
      alias
    );

    if (!userEntity) {
      throw new Error("User does not exist with these credentials");
    }
    const userPassword = userEntity.password;
    const isValidPassword = await bcrypt.compare(password, userPassword);
    if (!isValidPassword) {
      throw new Error("Invalid alias or password");
    }

    const fileName = `${alias}_Image`;
    const imageUrl = await this.imageDao.getImage(fileName);

    const userDto: UserDto = {
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      alias: userEntity.alias,
      imageUrl: imageUrl,
    };

    const authToken: AuthToken = AuthToken.Generate();
    const authEntity: AuthEntity = {
      alias: alias,
      token: authToken.token,
      timestamp: authToken.timestamp,
    };
    await this.authDao.putAuth(authEntity);

    return [userDto, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthToken]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    if ((await this.userDao.getUser(alias)) != undefined) {
      throw new Error("Invalid registration");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userEntity: UserEntity = {
      alias,
      password: hashedPassword,
      firstName,
      lastName,
    };

    await this.userDao.putUser(userEntity);
    const fileName = `${alias}_Image`;
    const imageUrl = await this.imageDao.putImage(fileName, userImageBytes);

    const userDto: UserDto = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageUrl,
    };

    const authToken: AuthToken = AuthToken.Generate();
    const authEntity: AuthEntity = {
      alias: alias,
      token: authToken.token,
      timestamp: authToken.timestamp,
    };
    await this.authDao.putAuth(authEntity);

    return [userDto, authToken];
  }

  public async logout(token: string): Promise<void> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const validAuth = await this.authDao.checkAuth(token);
    if (!validAuth) {
      throw new Error("Error logging out");
    }
    console.log("token in logout: ", token, "\n");

    await this.authDao.deleteAuth(token);
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const userEntity = await this.userDao.getUser(alias);

    if (!userEntity) {
      throw new Error("error getting user");
    }

    const fileName = `${alias}_Image`;
    const imageUrl = await this.imageDao.getImage(fileName);

    const userDto: UserDto = {
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      alias: userEntity.alias,
      imageUrl: imageUrl,
    };

    return userDto;
  }
}
