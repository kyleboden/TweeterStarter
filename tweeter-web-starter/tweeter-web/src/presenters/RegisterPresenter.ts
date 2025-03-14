import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { AuthView } from "./Presenter";
import { User, AuthToken } from "tweeter-shared";
import { AuthPresenter } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  public constructor(view: RegisterView) {
    super(view);
  }

  protected async serviceCall(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return await this._userService.register(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension
    );
  }

  protected navigateCall(): void {
    this._view.navigate("/");
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._view.setImageFileExtension(fileExtension);
      }
    } else {
      this._view.setImageUrl("");
      this._view.setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ) {
    this.doAuth(
      this._rememberMe,
      () =>
        this.serviceCall(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
      () => this.navigateCall(),
      "register"
    );
  }
}
