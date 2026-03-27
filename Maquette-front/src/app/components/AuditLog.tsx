import { Link } from "react-router";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AuditLog() {
  const { user } = useAuth();

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Accès réservé aux administrateurs</p>
        <Link to="/" className="text-blue-900 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Journal d'audit</h1>
        <p className="text-gray-600 text-sm">Historique des actions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Fonctionnalité en cours de développement</p>
      </div>
    </div>
  );
}
