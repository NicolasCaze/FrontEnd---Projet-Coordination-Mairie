import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
    };
    handleLogout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-sm w-full text-center">
        <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Déconnexion réussie</h2>
        <p className="text-gray-600 text-sm mb-6">
          Vous avez été déconnecté avec succès.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            to="/login"
            className="w-full py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            Se reconnecter
          </Link>
          <Link
            to="/"
            className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
