import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "../src/compenents/layout";
import Category from "./pages/category";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Chat from "./pages/chat";
import QuizPage from "./pages/quiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Chat />} />
          <Route path="/category" element={<Category />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
