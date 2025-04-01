import { AuthDAO } from "../dao/daoInterfaces/AuthDAO";
import { FollowsDAO } from "../dao/daoInterfaces/FollowsDAO";
import { ImageDAO } from "../dao/daoInterfaces/ImageDAO";
import { StatusDAO } from "../dao/daoInterfaces/StatusDAO";
import { UserDAO } from "../dao/daoInterfaces/UserDAO";

export interface Factory {
  getFollowsDAO(): FollowsDAO;
  getStatusDAO(): StatusDAO;
  getUserDAO(): UserDAO;
  getAuthDAO(): AuthDAO;
  getImageDAO(): ImageDAO;
}
