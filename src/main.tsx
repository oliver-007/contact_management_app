import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./RTK/store/store";
import router from "./routes/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <div id="loaderModal"></div>
      <div id="editModal"></div>
    </Provider>
  </StrictMode>
);
