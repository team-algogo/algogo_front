
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { userType, authorization } = useAuthStore();
    const location = useLocation();
    const isLoggedIn = !!userType && !!authorization;

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/intro"
                state={{ requireLogin: true, from: location.pathname }}
                replace
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
