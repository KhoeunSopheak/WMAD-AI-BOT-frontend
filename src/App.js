import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "../src/compenents/layout";
import Category from "./pages/category";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Chat from "./pages/chat";
import QuizPage from "./pages/quiz";
import RoadMap from "./pages/roadmap";
import DetailPage from "./pages/detailPage";
import Dashboard from "./pages/dashboard";
import User from "./pages/user";
import UserLock from "./pages/disableUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/userLock" element={<UserLock />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/category/:categoryTitle" element={<Chat />} />
          <Route path="/category" element={<Category />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/roadMap" element={<RoadMap />} />
          <Route path="/roadmap/:roadmapId/child/:childTitle" element={<DetailPage />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
