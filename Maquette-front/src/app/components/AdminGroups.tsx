import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { Users, ArrowLeft, Plus, Settings, AlertCircle, X } from "lucide-react";
import { mockGroups } from "../data/mockData";

interface Group {
  id: string;
  name: string;
  type: string;
  description: string;
  memberCount: number;
}

const initialGroups: Group[] = mockGroups.map((g, i) => ({
  ...g,
  memberCount: [3, 4, 2, 3][i] ?? 0,
}));

export function AdminGroups() {
  const { currentUser } = useOutletContext<any>();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "association", description: "" });
  const [error, setError] = useState("");

  if (!currentUser || (currentUser.role !== "super-admin" && currentUser.role !== "admin-conseil")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Accès réservé aux administrateurs</p>
        <Link to="/" className="text-blue-900 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Le nom du groupe est obligatoire."); return; }
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      description: form.description.trim(),
      memberCount: 0,
    };
    setGroups((prev) => [...prev, newGroup]);
    setForm({ name: "", type: "association", description: "" });
    setError("");
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ name: "", type: "association", description: "" });
    setError("");
  };

  const typeLabel: Record<string, string> = {
    association: "Association",
    service: "Service",
    team: "Équipe",
    council: "Conseil",
  };

  const typeColor: Record<string, string> = {
    association: "bg-blue-100 text-blue-700",
    service: "bg-green-100 text-green-700",
    team: "bg-orange-100 text-orange-700",
    council: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des groupes</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-500 transition"
          >
            <Plus className="w-4 h-4" />
            Créer un groupe
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-green-600" />
          Groupes existants
          <span className="ml-auto text-xs font-normal text-gray-400">{groups.length} groupe{groups.length > 1 ? "s" : ""}</span>
        </h2>

        {groups.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 py-3">
                <div className="bg-green-100 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{group.name}</p>
                  <p className="text-xs text-gray-500">{group.description || "—"}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor[group.type] ?? "bg-gray-100 text-gray-600"}`}>
                  {typeLabel[group.type] ?? group.type}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {group.memberCount}
                </span>
                <Link
                  to={`/groups/${group.id}/manage`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                >
                  <Settings className="w-3 h-3" />
                  Gérer
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">Aucun groupe créé pour l'instant.</p>
        )}
      </div>

      {/* Modal création */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={handleClose}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-green-600" />
                Créer un groupe
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nom du groupe *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                  placeholder="Ex : Associations culturelles"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  autoFocus
                />
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="association">Association</option>
                  <option value="service">Service</option>
                  <option value="team">Équipe</option>
                  <option value="council">Conseil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description courte du groupe..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-500 transition"
              >
                Créer le groupe
              </button>
            </form>

            <button onClick={handleClose} className="w-full mt-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
