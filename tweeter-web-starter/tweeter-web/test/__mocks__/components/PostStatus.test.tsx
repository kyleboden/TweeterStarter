import { render, screen } from "@testing-library/react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("Post Status Component", () => {
  const mockUser = mock<User>();
  let mockUserInstance: User;
  const mockAuthToken = mock<AuthToken>();
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    mockUserInstance = instance(mockUser);
    mockAuthTokenInstance = instance(mockAuthToken);
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with both the Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("enables both the Post Status and Clear buttons when the text field has text", async () => {
    const { postStatusButton, clearStatusButton, postField, user } =
      renderPostStatusAndGetElements();
    await user.type(postField, "hello");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("disables both the Post Status and Clear buttons when the text field is cleared", async () => {
    const { postStatusButton, clearStatusButton, postField, user } =
      renderPostStatusAndGetElements();
    await user.type(postField, "hello");

    await user.clear(postField);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with the correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const postText = "hello";
    const { postStatusButton, postField, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(postField, postText);

    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(
        mockAuthTokenInstance,
        mockUserInstance,
        postText
      )
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", {
    name: /Post Status/i,
  });
  const clearStatusButton = screen.getByRole("button", {
    name: /Clear/i,
  });
  const postField = screen.getByLabelText("textArea");

  return { postStatusButton, clearStatusButton, postField, user };
};
