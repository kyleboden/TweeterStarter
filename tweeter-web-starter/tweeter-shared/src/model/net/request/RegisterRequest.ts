import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly userImageBytes: Uint8Array;
  readonly imageFileExtension: string;
}
