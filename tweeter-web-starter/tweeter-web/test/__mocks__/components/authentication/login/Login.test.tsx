import { MemoryRouter } from "react-router-dom";
import Login from "../../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../../src/presenters/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign-in button is disabled.", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button when both the alias and password fields have text.", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "1");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("disables the sign-in button if either the alias or password field is cleared.", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();
  });

  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "@someAlias";
    const password = "myPassword";
    // const rememberMe = false;

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, originalUrl)).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};

// When first rendered the sign-in button is disabled.
// The sign-in button is enabled when both the alias and password fields have text.
// The sign-in button is disabled if either the alias or password field is cleared.
// The presenter's login method is called with correct parameters when the sign-in button is pressed.
