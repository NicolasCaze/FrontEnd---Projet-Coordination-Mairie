import { Link } from "react-router";
import { Calendar, Users, AlertCircle, Package, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AdminDashboard() {
  const { user } = useAuth();

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Accès réservé aux administrateurs</p>
          <Link to="/" className="text-blue-900 hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3">Tableau de bord administrateur</h1>
        <p className="text-gray-600 text-lg">Sélectionnez une section à gérer</p>
      </div>

      {/* Blocs principaux - 3 ou 4 selon le rôle */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto ${user.role !== "SUPER_ADMIN" ? "lg:grid-cols-3" : ""}`}>
        {/* Bloc Réservations */}
        <Link
          to="/admin/bookings"
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 p-4 rounded-xl">
              <Calendar className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Réservations</h2>
          <p className="text-blue-100 mb-6">
            Gérer toutes les réservations : validation, refus et suivi des demandes
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Accéder à la gestion
            <span className="text-lg">→</span>
          </div>
        </Link>

        {/* Bloc Groupes */}
        <Link
          to="/admin/manage-groupes"
          className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 p-4 rounded-xl">
              <UserCog className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Groupes</h2>
          <p className="text-purple-100 mb-6">
            Créer et gérer les groupes, assigner des administrateurs de groupe
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Accéder à la gestion
            <span className="text-lg">→</span>
          </div>
        </Link>

        {/* Bloc Biens */}
        <Link
          to="/admin/manage-biens"
          className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 p-4 rounded-xl">
              <Package className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Biens</h2>
          <p className="text-green-100 mb-6">
            Gérer les salles, équipements et ressources disponibles à la réservation
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Accéder à la gestion
            <span className="text-lg">→</span>
          </div>
        </Link>

        {/* Bloc Utilisateurs - Uniquement pour SUPER_ADMIN */}
        {user.role === "SUPER_ADMIN" && (
          <Link
            to="/admin/users"
            className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 p-4 rounded-xl">
                <Users className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Utilisateurs</h2>
            <p className="text-amber-100 mb-6">
              Gérer les comptes utilisateurs et promouvoir des administrateurs
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
              Accéder à la gestion
              <span className="text-lg">→</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
