import { Route, Routes } from "react-router-dom";

import { About } from "./Pages/About";
import { Home } from "./Pages/Home";
import { Layout } from "./Pages/Layout";
import { Users } from "./Pages/Users";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
