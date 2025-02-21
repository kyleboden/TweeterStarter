import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";

import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model/StatusService";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model/FollowService";
import { ItemView } from "./presenters/Presenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller<Status, StatusService>
              key={"feed"}
              presenterGenerator={(view: ItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentGenerator={(Status) => (
                <StatusItem status={Status} />
              )}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StatusService>
              key={"story"}
              presenterGenerator={(view: ItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentGenerator={(Status) => (
                <StatusItem status={Status} />
              )}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService>
              key={"followees"}
              presenterGenerator={(view: ItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentGenerator={(User) => <UserItem value={User} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService>
              key={"followers"}
              presenterGenerator={(view: ItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentGenerator={(User) => <UserItem value={User} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
