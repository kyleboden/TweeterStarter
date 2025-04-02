import { AuthEntity } from "../entity/AuthEntity";

export interface AuthDAO {
  putAuth(authToken: AuthEntity): Promise<void>;

  getAuth(token: string): Promise<AuthEntity | undefined>;

  deleteAuth(token: string): Promise<void>;

  updateAuth(token: string, timestamp: number): Promise<void>;

  checkAuth(token: string): Promise<boolean>;
}
