import { Route, Routes } from "react-router-dom";

import { About } from "./pages/About";
import { Hospitalized } from "./pages/Hospitalized";
import { Error } from "./pages/Error";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { Page404 } from "./pages/Page404";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} errorElement={<Error />}>
        <Route index element={<Home />} errorElement={<Error />} />
        <Route
          path="hospitalized"
          element={<Hospitalized />}
          errorElement={<Error />}
        />
        <Route path="about" element={<About />} errorElement={<Error />} />
      </Route>

      <Route path="*" element={<Page404 />} errorElement={<Error />} />
    </Routes>
  );
}

export default App;
