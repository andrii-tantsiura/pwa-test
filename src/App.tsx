import { Route, Routes } from "react-router-dom";

import { About } from "./Pages/About";
import { Hospitalized } from "./Pages/Hospitalized";
import { Error } from "./Pages/Error";
import { Home } from "./Pages/Home";
import { Layout } from "./Pages/Layout";
import { Page404 } from "./Pages/Page404";

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
