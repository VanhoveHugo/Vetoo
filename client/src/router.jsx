import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./provider/auth.provider";

import Login from "./pages/authentication/login";
import Register from "./pages/authentication/register";

import Dashboard from "./pages/account/layout";
import Profil from "./pages/account/profile/index";

import TermsOfUse from "./pages/legal/terms-of-use";
import LegalNotice from "./pages/legal/legal-notice";
import PrivacyPolicy from "./pages/legal/privacy-policy";
import CreatePetForm from "./pages/account/pet/create";
import PetPage from "./pages/account/pet/index";
import EditPetPage from "./pages/account/pet/edit";
import CreateWeightForm from "./pages/account/pet/weight/create";
import CreateAppointmentsForm from "./pages/account/pet/appointments/create";
import NotFound from "./pages/404";
import AppointmentDetailPage from "./pages/account/pet/appointments";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/conditions-générales-utilisation",
      element: <TermsOfUse />,
    },
    {
      path: "/mentions-légales",
      element: <LegalNotice />,
    },
    {
      path: "/politique-de-confidentialité",
      element: <PrivacyPolicy />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "/",
          element: <Profil />,
        },
      ],
    },
    {
      path: "/new-pet",
      element: <CreatePetForm />,
    },
    {
      path: "/pet/:id",
      element: <PetPage />,
    },
    {
      path: "/pet/edit/:id",
      element: <EditPetPage />,
    },
    {
      path: "/weight/:id",
      element: <CreateWeightForm />,
    },
    {
      path: "/new-appointment/:id",
      element: <CreateAppointmentsForm />,
    },
    {
      path: "/appointment/:id",
      element: <AppointmentDetailPage />
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
