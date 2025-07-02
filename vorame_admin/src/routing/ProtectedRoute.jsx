import { Navigate } from "react-router-dom";
import authHandler from "../managers/auth";

const ProtectedRoute = () => {
    const token = authHandler.getToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute