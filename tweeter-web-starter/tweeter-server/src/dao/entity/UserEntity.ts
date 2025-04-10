export type UserEntity = {
  readonly alias: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  // readonly userImageBytes: string;
  // readonly imageFileExtension: string;
  readonly followeeCount: number;
  readonly followerCount: number;
};
