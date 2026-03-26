import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { Users, Hash, ArrowLeft, UserPlus, CheckCircle, Clock, X, LogOut, ShieldCheck, Settings } from "lucide-react";
import { mockGroups } from "../data/mockData";

type GroupStatus = "joined" | "pending";

interface UserGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  status: GroupStatus;
  isAdmin?: boolean;
  memberCount: number;
  pendingCount: number;
}

const mockUserGroupsBase: UserGroup[] = [
  { id: "g2", name: "Association Sportive", description: "Association locale de sports", type: "association", status: "joined", memberCount: 12, pendingCount: 0 },
  { id: "g4", name: "Comité des Fêtes", description: "Organisation des événements locaux", type: "association", status: "pending", memberCount: 8, pendingCount: 0 },
];

const mockAdminGroupeGroups: UserGroup[] = [
  { id: "g2", name: "Association Sportive", description: "Association locale de sports", type: "association", status: "joined", isAdmin: true, memberCount: 12, pendingCount: 3 },
  { id: "g4", name: "Comité des Fêtes", description: "Organisation des événements locaux", type: "association", status: "pending", memberCount: 8, pendingCount: 0 },
];

const mockMunicipalGroups: UserGroup[] = mockGroups.map((g, i) => ({
  id: g.id,
  name: g.name,
  description: g.description,
  type: g.type,
  status: "joined" as GroupStatus,
  isAdmin: true,
  memberCount: [12, 8, 5, 20][i] ?? 10,
  pendingCount: [3, 0, 2, 1][i] ?? 0,
}));

export function MyGroups() {
  const { currentUser } = useOutletContext<any>();
  const initialGroups =
    currentUser?.role === "admin-conseil" ? mockMunicipalGroups
    : currentUser?.role === "admin-groupe" ? mockAdminGroupeGroups
    : mockUserGroupsBase;
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-500 mb-4">Veuillez vous connecter</p>
        <Link to="/login" className="text-blue-900 hover:underline">Se connecter</Link>
      </div>
    );
  }

  const isManagerRole = currentUser.role === "admin-conseil" || currentUser.role === "super-admin";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 8) { setCode(value); setError(""); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 8) { setError("Le code doit contenir exactement 8 caractères."); return; }
    setSubmitted(true);
    setCode("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCode("");
    setError("");
    setSubmitted(false);
  };

  const handleRemove = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mes groupes</h1>
          {!isManagerRole && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition"
            >
              <UserPlus className="w-4 h-4" />
              Rejoindre un groupe
            </button>
          )}
        </div>
      </div>

      {/* Liste des groupes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-900" />
          Liste des groupes
        </h2>

        {groups.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 py-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${group.isAdmin ? "bg-purple-100" : "bg-blue-100"}`}>
                  {group.isAdmin
                    ? <ShieldCheck className="w-4 h-4 text-purple-700" />
                    : <Users className="w-4 h-4 text-blue-900" />
                  }
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{group.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {group.memberCount} membre{group.memberCount > 1 ? "s" : ""}
                    </span>
                    {group.isAdmin && group.pendingCount > 0 && (
                      <span className="text-xs text-orange-600 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" />
                        {group.pendingCount} en attente
                      </span>
                    )}
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                  group.isAdmin
                    ? "bg-purple-100 text-purple-700"
                    : group.status === "joined"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {group.isAdmin
                    ? <><ShieldCheck className="w-3 h-3" /> Administrateur</>
                    : group.status === "joined"
                    ? <><CheckCircle className="w-3 h-3" /> Rejoint</>
                    : <><Clock className="w-3 h-3" /> En attente</>
                  }
                </span>

                {(isManagerRole || group.isAdmin) ? (
                  <Link
                    to={`/groups/${group.id}/manage`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 transition"
                  >
                    <Settings className="w-3 h-3" />
                    Gérer
                  </Link>
                ) : (
                  <>
                    <Link
                      to={`/groups/${group.id}/manage`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 transition"
                    >
                      <Users className="w-3 h-3" />
                      Voir
                    </Link>
                    <button
                      onClick={() => handleRemove(group.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        group.status === "joined"
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {group.status === "joined"
                        ? <><LogOut className="w-3 h-3" /> Quitter</>
                        : <><X className="w-3 h-3" /> Annuler</>
                      }
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            Vous n'avez rejoint aucun groupe pour l'instant.
          </p>
        )}
      </div>

      {/* Modal rejoindre un groupe */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-700" />
                Rejoindre un groupe
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Saisissez le code de 8 caractères fourni par votre administrateur de groupe.
            </p>
            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm mb-4">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Demande envoyée, en attente de validation.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="relative mb-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={code}
                    onChange={handleChange}
                    placeholder="EX : A1B2C3D4"
                    maxLength={8}
                    autoFocus
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm font-mono tracking-widest uppercase focus:ring-2 focus:ring-purple-500 focus:border-transparent ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  />
                </div>
                <div className="flex justify-between mb-4">
                  {error ? <p className="text-xs text-red-600">{error}</p> : <span />}
                  <p className="text-xs text-gray-400 ml-auto">{code.length}/8</p>
                </div>
                <button
                  type="submit"
                  disabled={code.length !== 8}
                  className="w-full py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Envoyer la demande
                </button>
              </form>
            )}
            <button onClick={handleCloseModal} className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
