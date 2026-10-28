import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import { useProfile } from "./context/useProfile";
import Account from "./pages/Account/Account";
import Help from "./pages/Help/Help";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import MyList from "./pages/MyList/MyList";
import NewsAndPopular from "./pages/NewsAndPopular/NewsAndPopular";
import NotFound from "./pages/NotFound/NotFound";
import Search from "./pages/Search/Search";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import TvShows from "./pages/TvShows/TvShows";

function RequireAuth() {
  const { signedIn } = useProfile();
  const location = useLocation();

  if (!signedIn) {
    return (
      <Navigate to="/signin" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="tv" element={<TvShows />} />
          <Route path="movies" element={<Movies />} />
          <Route path="news" element={<NewsAndPopular />} />
          <Route path="mylist" element={<MyList />} />
          <Route path="search" element={<Search />} />
          <Route path="account" element={<Account />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
