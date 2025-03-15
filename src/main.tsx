import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import Appointments from './pages/Appointments.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Patients from './pages/Patients.tsx'
import { Toaster } from 'sonner';
import { SidebarTrigger } from './components/ui/sidebar.tsx';
import { StrictMode, Suspense } from 'react';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import AppSidebar from './components/layout/AppSidebar.tsx';
import { LoadingSpinner } from './components/ui/loading';
import PatientDetail from './pages/PatientDetail.tsx';
import NotFound from './pages/NotFound.tsx';
import { AppointmentDetailsPage } from './pages/appointments/AppointmentDetailsPage';

// Create a Layout component to wrap the sidebar and main content
const Layout = () => (
  <div className="flex w-screen">
    <AppSidebar />
    <div className="flex-1">
      <SidebarTrigger className="ml-1 cursor-pointer" />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "appointments",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Appointments />
              </Suspense>
            ),
          },
          {
            path: "appointments/:id",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AppointmentDetailsPage />
              </Suspense>
            ),
          },
          {
            path: "patients",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Patients />
              </Suspense>
            ),
          },
          {
            path: "patients/:id",
            element:(
              <Suspense fallback={<LoadingSpinner />}>
                <PatientDetail />
              </Suspense>
            )
          },
          {
            path: "finance",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            ),
          },
          {
            path: "prescriptions",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            ),
          },
          {
            path: "reports",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </SidebarProvider>
  </StrictMode>
);
