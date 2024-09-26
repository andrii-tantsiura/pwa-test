import { Route, Routes } from "react-router-dom";

import { About } from "./Pages/About";
import { Home } from "./Pages/Home";
import { Layout } from "./Pages/Layout";
import { Page404 } from "./Pages/Page404";
import { Users } from "./Pages/Users";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
