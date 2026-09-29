import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./features/login/pages/Login";
import Register from "./features/Register/pages/Register";
import Dashboard from "./features/Dashboard/pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoutes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={ <Navigate to="/dashboard" replace />}
        />

        <Route path="/login" element={<Login />}/>

        <Route path="/register" element={<Register />}/>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />
        </Route>

        <Route path="*"
          element={
            <Navigate to="/dashboard" replace/>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;