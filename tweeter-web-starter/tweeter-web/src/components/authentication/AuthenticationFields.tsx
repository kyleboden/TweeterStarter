import { useState } from "react";

interface Props {
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAlias: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setPassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthenticationFields = (props: Props) => {
  // const [alias, setAlias] = useState("");
  // const [password, setPassword] = useState("");

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={props.onKeyDown}
          onChange={props.setAlias}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={props.onKeyDown}
          onChange={props.setPassword}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
