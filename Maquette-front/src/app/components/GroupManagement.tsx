import { useState } from "react";
import { useParams, Link, useOutletContext } from "react-router";
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, UserMinus, ShieldCheck } from "lucide-react";
import { mockGroups } from "../data/mockData";
import { mockGroupMembers, mockGroupPending, type GroupMember as Member, type GroupPendingRequest as PendingRequest } from "../data/mockGroupData";

export function GroupManagement() {
  const { groupId } = useParams<{ groupId: string }>();
  const { currentUser } = useOutletContext<any>();

  const group = mockGroups.find((g) => g.id === groupId);
  const [members, setMembers] = useState<Member[]>(mockGroupMembers[groupId ?? ""] ?? []);
  const [pending, setPending] = useState<PendingRequest[]>(mockGroupPending[groupId ?? ""] ?? []);

  // Détermine si l'utilisateur courant est admin de ce groupe
  const currentMember = members.find((m) => m.id === currentUser?.id);
  const isGroupAdmin =
    currentUser?.role === "super-admin" ||
    currentUser?.role === "admin-conseil" ||
    (currentUser?.role === "admin-groupe" && currentMember?.role === "admin-groupe");

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Groupe introuvable.</p>
        <Link to="/my-groups" className="text-blue-900 hover:underline">Retour</Link>
      </div>
    );
  }

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAccept = (id: string) => {
    setPending((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setPending((prev) => prev.filter((r) => r.id !== id));
  };

  const canRemove = (member: Member) => {
    if (!isGroupAdmin) return false;
    if (currentUser?.role === "super-admin") return true;
    // admin-conseil et admin-groupe ne peuvent pas retirer un admin
    if (member.role === "admin-conseil" || member.role === "super-admin" || member.role === "admin-groupe") return false;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/my-groups" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour à mes groupes
        </Link>
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{group.description}</p>
      </div>

      {/* Membres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-900" />
          Membres
          <span className="ml-auto text-xs font-normal text-gray-400">{members.length} membre{members.length > 1 ? "s" : ""}</span>
        </h2>

        {members.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  member.role === "admin-conseil" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {member.role === "admin-conseil"
                    ? <ShieldCheck className="w-4 h-4" />
                    : `${member.firstName[0]}${member.lastName[0] ?? ""}`
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{member.firstName} {member.lastName}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                {member.role === "admin-conseil" && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    Admin-Conseil
                  </span>
                )}
                {member.role === "admin-groupe" && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    Admin-Groupe
                  </span>
                )}
                {isGroupAdmin && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={!canRemove(member)}
                    title={!canRemove(member) ? "Impossible de retirer un administrateur" : "Retirer du groupe"}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      canRemove(member)
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <UserMinus className="w-3 h-3" />
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Aucun membre dans ce groupe.</p>
        )}
      </div>

      {/* Demandes en attente - visible uniquement pour les admins */}
      {isGroupAdmin && <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-orange-600" />
          Demandes en attente
          {pending.length > 0 && (
            <span className="ml-auto text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h2>

        {pending.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {pending.map((req) => (
              <div key={req.id} className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-orange-700">
                  {req.firstName[0]}{req.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{req.firstName} {req.lastName}</p>
                  <p className="text-xs text-gray-500">{req.email}</p>
                </div>
                <span className="text-xs text-gray-400 mr-2">
                  {new Date(req.requestedAt).toLocaleDateString("fr-FR")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Valider
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
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
          <p className="text-sm text-gray-500 text-center py-4">Aucune demande en attente.</p>
        )}
      </div>}
    </div>
  );
}
