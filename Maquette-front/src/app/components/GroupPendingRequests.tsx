import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { mockGroups } from "../data/mockData";
import { mockGroupMembers, mockGroupPending, type GroupPendingRequest } from "../data/mockGroupData";

export function GroupPendingRequests() {
  const { currentUser } = useOutletContext<any>();

  // Groupes où l'utilisateur courant est admin-groupe
  const adminGroupIds = Object.entries(mockGroupMembers)
    .filter(([, members]) =>
      members.some((m) => m.id === currentUser?.id && m.role === "admin-groupe")
    )
    .map(([groupId]) => groupId);

  const initialPending: Record<string, GroupPendingRequest[]> = {};
  adminGroupIds.forEach((id) => {
    initialPending[id] = [...(mockGroupPending[id] ?? [])];
  });

  const [pendingByGroup, setPendingByGroup] = useState(initialPending);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Veuillez vous connecter</p>
      </div>
    );
  }

  const handleValidate = (groupId: string, requestId: string) => {
    setPendingByGroup((prev) => ({
      ...prev,
      [groupId]: prev[groupId].filter((r) => r.id !== requestId),
    }));
  };

  const handleReject = (groupId: string, requestId: string) => {
    setPendingByGroup((prev) => ({
      ...prev,
      [groupId]: prev[groupId].filter((r) => r.id !== requestId),
    }));
  };

  const groupsWithData = adminGroupIds
    .map((id) => ({
      group: mockGroups.find((g) => g.id === id),
      pending: pendingByGroup[id] ?? [],
    }))
    .filter((g) => g.group !== undefined);

  const totalPending = groupsWithData.reduce((sum, g) => sum + g.pending.length, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Demandes d'adhésion en attente</h1>
            <p className="text-gray-600 text-sm">Validez ou refusez les demandes pour vos groupes</p>
          </div>
          {totalPending > 0 && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              {totalPending} en attente
            </span>
          )}
        </div>
      </div>

      {groupsWithData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Vous n'administrez aucun groupe</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupsWithData.map(({ group, pending }) => (
            <div key={group!.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* En-tête groupe */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span className="font-bold text-sm">{group!.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{group!.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {pending.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      {pending.length} en attente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      À jour
                    </span>
                  )}
                  <Link
                    to={`/groups/${group!.id}/manage`}
                    className="text-xs text-blue-700 hover:underline"
                  >
                    Gérer le groupe →
                  </Link>
                </div>
              </div>

              {/* Liste des demandes */}
              {pending.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {pending.map((req) => (
                    <div key={req.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{req.firstName} {req.lastName}</p>
                        <p className="text-xs text-gray-500">
                          {req.email} · Demandé le {new Date(req.requestedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleValidate(group!.id, req.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Valider
                        </button>
                        <button
                          onClick={() => handleReject(group!.id, req.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                        >
                          <XCircle className="w-3 h-3" />
                          Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Aucune demande en attente pour ce groupe</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
