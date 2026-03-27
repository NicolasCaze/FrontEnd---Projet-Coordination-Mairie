import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, Users, AlertCircle, CheckCircle, Clock, UserCheck, Loader2 } from "lucide-react";
import { reservationService } from "@/services/reservationService";
import { userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

const getActionBadge = (action: string) => {
  const colors: Record<string, string> = {
    CREATE_BOOKING: "bg-green-100 text-green-800",
    UPDATE_USER: "bg-blue-100 text-blue-800",
    APPROVE_BOOKING: "bg-purple-100 text-purple-800",
    REJECT_BOOKING: "bg-red-100 text-red-800",
    DELETE_USER: "bg-red-100 text-red-800",
    IMPERSONATE: "bg-yellow-100 text-yellow-800",
  };
  return colors[action] || "bg-gray-100 text-gray-800";
};

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    CREATE_BOOKING: "Création réservation",
    UPDATE_USER: "Modification utilisateur",
    APPROVE_BOOKING: "Validation réservation",
    REJECT_BOOKING: "Refus réservation",
    DELETE_USER: "Suppression utilisateur",
    IMPERSONATE: "Impersonation",
  };
  return labels[action] || action;
};

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingBookings: 0,
    approvedBookings: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reservations, users] = await Promise.all([
          reservationService.getAll({}),
          userService.getAll({})
        ]);
        
        setStats({
          pendingBookings: reservations.content.filter(r => r.statut === "EN_ATTENTE").length,
          approvedBookings: reservations.content.filter(r => r.statut === "CONFIRMEE").length,
          totalUsers: users.totalElements
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === "ADMIN") {
      fetchStats();
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Administration</h1>
        <p className="text-gray-600 text-sm">Tableau de bord de gestion du système de réservation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Réservations en attente</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</p>
            </div>
            <div className="bg-orange-100 w-9 h-9 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <Link to="/admin/bookings" className="text-xs text-blue-700 hover:underline">Voir la liste →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Réservations validées</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedBookings}</p>
            </div>
            <div className="bg-green-100 w-9 h-9 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <Link to="/admin/bookings" className="text-xs text-blue-700 hover:underline">Voir la liste →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Demandes de groupe en attente</p>
              <p className="text-2xl font-bold text-purple-700">{MOCK_PENDING_GROUPS}</p>
            </div>
            <div className="bg-purple-100 w-9 h-9 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <Link to="/admin/groups" className="text-xs text-blue-700 hover:underline">Voir la liste →</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Comptes sous tutelle</p>
              <p className="text-2xl font-bold text-gray-900">{supervisedUsers.length}</p>
            </div>
            <div className="bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-gray-700" />
            </div>
          </div>
          <Link to="/admin/accounts" className="text-xs text-blue-700 hover:underline">Gérer les comptes →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/catalog"
          className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-xl p-5 hover:shadow-lg transition group flex flex-col"
        >
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="text-base font-bold mb-1">Nouvelle réservation</h3>
          <p className="text-blue-100 text-sm mb-3">Consultez le catalogue et réservez une salle ou du matériel</p>
          <span className="mt-auto self-end inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Voir le catalogue →
          </span>
        </Link>

        <Link
          to="/admin/users"
          className="bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-xl p-5 hover:shadow-lg transition group flex flex-col"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-base font-bold mb-1">Gestion des utilisateurs</h3>
          <p className="text-purple-100 text-sm mb-3">Consulter et gérer les comptes utilisateurs</p>
          <span className="mt-auto self-end inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Accéder →
          </span>
        </Link>

        <Link
          to="/admin/groups"
          className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-xl p-5 hover:shadow-lg transition group flex flex-col"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-base font-bold mb-1">Gestion des groupes</h3>
          <p className="text-green-100 text-sm mb-3">Créer et gérer les groupes</p>
          <span className="mt-auto self-end inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Gérer →
          </span>
        </Link>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-bold">Journal d'audit récent</h2>
          <Link to="/admin/audit" className="text-xs text-blue-700 hover:underline">Voir tout →</Link>
        </div>
        {mockAuditLog.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Administrateur</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Utilisateur cible</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Action</th>
                  <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockAuditLog.slice(0, 5).map((entry) => {
                  const admin = mockUsers.find((u) => u.id === entry.adminId);
                  const target = mockUsers.find((u) => u.id === entry.targetUserId);
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2.5 text-xs text-gray-600 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleDateString("fr-FR")}<br />
                        <span className="text-gray-400">{new Date(entry.timestamp).toLocaleTimeString("fr-FR")}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-semibold">{admin?.firstName} {admin?.lastName}</td>
                      <td className="px-4 py-2.5 text-xs">{target?.firstName} {target?.lastName}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getActionBadge(entry.action)}`}>
                          {getActionLabel(entry.action)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600">{entry.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">Aucune entrée dans le journal</div>
        )}
      </div>

    </div>
  );
}
