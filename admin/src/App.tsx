import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcement from "./pages/Announcement";
import Menu from "./pages/Menu";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import SiteInfo from "./pages/SiteInfo";
import PageCopy from "./pages/PageCopy";
import Admins from "./pages/Admins";
import { Alert } from "./components/ui";

function OwnerRoute({ children }: { children: React.ReactNode }) {
  const { isOwner } = useAuth();
  if (!isOwner) {
    return (
      <div className="max-w-md">
        <Alert type="error" message="Only owner accounts can manage admin users." />
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/site-info" element={<SiteInfo />} />
            <Route path="/page-copy" element={<PageCopy />} />
            <Route
              path="/admins"
              element={
                <OwnerRoute>
                  <Admins />
                </OwnerRoute>
              }
            />
          </Route>
          <Route path="*" element={<NavigateToDashboard />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

import { Navigate } from "react-router-dom";
function NavigateToDashboard() {
  return <Navigate to="/dashboard" replace />;
}
