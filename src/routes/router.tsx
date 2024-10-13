import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import AllContacts from "../components/AllContacts";
import RootLayout from "../layouts/RootLayout";
import Error from "../components/Error";
import ContactForm from "../components/ContactForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div> Loading... </div>}>
            <AllContacts />
          </Suspense>
        ),
      },
      {
        path: "/create-contact",
        element: <ContactForm />,
      },
    ],
  },
]);
export default router;
