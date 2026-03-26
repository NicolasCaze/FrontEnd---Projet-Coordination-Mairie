import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { mockAuditLog, mockUsers, AuditEntry } from "../data/mockData";
import { FileText, AlertCircle, ArrowLeft, Filter, Download, Calendar } from "lucide-react";

export function AuditLog() {
  const { currentUser } = useOutletContext<any>();
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!currentUser || (currentUser.role !== "super-admin" && currentUser.role !== "admin-conseil")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Accès réservé aux administrateurs</p>
          <Link to="/" className="text-blue-900 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const actionTypes = [
    ...new Set(mockAuditLog.map((entry) => entry.action)),
  ];

  const filteredLog = mockAuditLog.filter((entry) => {
    const matchesAction = filterAction === "all" || entry.action === filterAction;
    const matchesSearch =
      searchTerm === "" ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-blue-900 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Journal d'audit</h1>
        <p className="text-gray-600 text-lg">
          Traçabilité complète de toutes les actions administratives et impersonations
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">À propos du journal d'audit</h3>
            <p className="text-sm text-blue-800">
              Ce journal enregistre toutes les actions réalisées par les administrateurs,
              notamment les actions d'impersonation (agir pour le compte d'un utilisateur sous
              tutelle). Chaque entrée indique qui a agi, sur quel compte, quelle action, et
              quand.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total d'entrées</p>
          <p className="text-3xl font-bold text-blue-900">{mockAuditLog.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Impersonations</p>
          <p className="text-3xl font-bold text-yellow-600">
            {mockAuditLog.filter((e) => e.action === "IMPERSONATE").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Modifications</p>
          <p className="text-3xl font-bold text-purple-600">
            {mockAuditLog.filter((e) => e.action.includes("UPDATE")).length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Aujourd'hui</p>
          <p className="text-3xl font-bold text-green-600">
            {
              mockAuditLog.filter((e) =>
                e.timestamp.startsWith(new Date().toISOString().split("T")[0])
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher dans les entrées..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
            >
              <option value="all">Toutes les actions</option>
              {actionTypes.map((action) => (
                <option key={action} value={action}>
                  {getActionLabel(action)}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition whitespace-nowrap">
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Date & Heure
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Administrateur
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Utilisateur cible
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLog.map((entry) => {
                const admin = mockUsers.find((u) => u.id === entry.adminId);
                const targetUser = mockUsers.find((u) => u.id === entry.targetUserId);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-semibold">
                            {new Date(entry.timestamp).toLocaleDateString("fr-FR")}
                          </p>
                          <p className="text-gray-600">
                            {new Date(entry.timestamp).toLocaleTimeString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {admin?.firstName} {admin?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{admin?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">
                          {targetUser?.firstName} {targetUser?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {targetUser?.hasAccount ? "Compte autonome" : "Sous tutelle"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionBadge(
                          entry.action
                        )}`}
                      >
                        {getActionLabel(entry.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{entry.details}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLog.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune entrée trouvée</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold mb-3">Informations sur la traçabilité</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>
            • <strong>Conservation :</strong> Les entrées sont conservées conformément à la
            réglementation en vigueur
          </li>
          <li>
            • <strong>Impersonation :</strong> Toute action réalisée pour le compte d'un
            utilisateur sous tutelle est tracée
          </li>
          <li>
            • <strong>Consultation :</strong> Seuls les administrateurs peuvent consulter ce
            journal
          </li>
          <li>
            • <strong>Export :</strong> Les données peuvent être exportées pour archivage ou
            audit externe
          </li>
        </ul>
      </div>
    </div>
  );
}
