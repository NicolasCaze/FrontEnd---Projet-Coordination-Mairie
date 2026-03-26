import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { mockUsers, User } from "../data/mockData";
import { AlertCircle, ArrowLeft, User as UserIcon, Shield, Users, Pencil, Trash2, X, Save, UserPlus, Filter } from "lucide-react";

const roleBadge = (role: string) => {
  switch (role) {
    case "super-admin":
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800"><Shield className="w-3 h-3" />Super-Admin</span>;
    case "admin-conseil":
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800"><Shield className="w-3 h-3" />Admin-Conseil</span>;
    case "admin-groupe":
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"><Users className="w-3 h-3" />Admin-Groupe</span>;
    default:
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><UserIcon className="w-3 h-3" />Utilisateur</span>;
  }
};

const emptyForm = (): Partial<User> => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "utilisateur",
  hasAccount: true,
  groupIds: [],
  exemptions: { association: false, social: false, elected: false, dispense: false, justificatif: false, caution: false },
});

export function AdminUsers() {
  const { currentUser } = useOutletContext<any>();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [createForm, setCreateForm] = useState<Partial<User>>(emptyForm());
  const [filterRole, setFilterRole] = useState("all");
  const [filterType, setFilterType] = useState("all");

  if (!currentUser || (currentUser.role !== "super-admin" && currentUser.role !== "admin-conseil")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Accès réservé aux administrateurs</p>
        <Link to="/" className="text-blue-900 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === "super-admin";

  const canEdit = (target: User) => {
    if (target.id === currentUser.id) return false; // personne ne peut modifier son propre compte ici
    if (isSuperAdmin) return true;
    // admin-conseil ne peut pas modifier admin-conseil ou super-admin
    return target.role !== "admin-conseil" && target.role !== "super-admin";
  };

  const canDelete = (target: User) => {
    if (target.id === currentUser.id) return false;
    if (isSuperAdmin) return true;
    return target.role !== "admin-conseil" && target.role !== "super-admin";
  };

  const availableRoles = (): User["role"][] => {
    if (isSuperAdmin) return ["utilisateur", "admin-groupe", "admin-conseil", "super-admin"];
    return ["utilisateur", "admin-groupe"];
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchType = filterType === "all" || (filterType === "autonome" ? u.hasAccount : !u.hasAccount);
    return matchRole && matchType;
  });

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role, hasAccount: user.hasAccount, exemptions: { ...user.exemptions } });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...editForm } : u));
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

  const handleCreate = () => {
    if (!createForm.firstName) return;
    const newUser: User = {
      id: `u${Date.now()}`,
      firstName: createForm.firstName ?? "",
      lastName: createForm.lastName ?? "",
      email: createForm.email ?? "",
      phone: createForm.phone ?? "",
      role: createForm.role ?? "utilisateur",
      hasAccount: createForm.hasAccount ?? true,
      groupIds: [],
      exemptions: { association: false, social: false, elected: false, dispense: false, justificatif: false, caution: false },
    };
    setUsers((prev) => [...prev, newUser]);
    setShowCreate(false);
    setCreateForm(emptyForm());
  };

  const roleFilterOptions = [
    { value: "all", label: "Tous les rôles" },
    { value: "utilisateur", label: "Utilisateur" },
    { value: "admin-groupe", label: "Admin-Groupe" },
    { value: "admin-conseil", label: "Admin-Conseil" },
    { value: "super-admin", label: "Super-Admin" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Gestion des utilisateurs</h1>
            <p className="text-gray-600 text-sm">Liste de tous les comptes du système</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            <UserPlus className="w-4 h-4" />
            Créer un utilisateur
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-4">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Rôle :</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {roleFilterOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Type :</span>
          <div className="flex gap-1.5">
            {[
              { value: "all", label: "Tous" },
              { value: "autonome", label: "Autonome" },
              { value: "tutelle", label: "Sous-tutelle" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterType(value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  filterType === value ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <span className="ml-auto text-xs text-gray-400">{filteredUsers.length} résultat{filteredUsers.length > 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Nom</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Email</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Téléphone</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Rôle</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-600">Type</th>
                <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-sm text-gray-400 py-8">Aucun utilisateur ne correspond aux filtres</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-semibold">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email || <span className="text-gray-400 italic">—</span>}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.phone || <span className="text-gray-400 italic">—</span>}</td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    {user.hasAccount
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">Autonome</span>
                      : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Sous-tutelle</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit(user) && (
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                        >
                          <Pencil className="w-3 h-3" />
                          Modifier
                        </button>
                      )}
                      {canDelete(user) && (
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Modifier */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setEditingUser(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold">Modifier le profil</h2>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <UserForm form={editForm} setForm={setEditForm} roles={availableRoles()} />
            <div className="flex gap-3 mt-5">
              <button onClick={handleSaveEdit} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition">
                <Save className="w-4 h-4" />Enregistrer
              </button>
              <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold">Créer un utilisateur</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <UserForm form={createForm} setForm={setCreateForm} roles={availableRoles()} />
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCreate}
                disabled={!createForm.firstName}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" />Créer
              </button>
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-bold">Confirmer la suppression</h2>
                <p className="text-xs text-gray-500">Cette action est irréversible</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">
              Voulez-vous vraiment supprimer le compte de <strong>{users.find((u) => u.id === deleteConfirm)?.firstName} {users.find((u) => u.id === deleteConfirm)?.lastName}</strong> ?
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                Supprimer
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserForm({ form, setForm, roles }: {
  form: Partial<User>;
  setForm: React.Dispatch<React.SetStateAction<Partial<User>>>;
  roles: User["role"][];
}) {
  const roleLabels: Record<string, string> = {
    utilisateur: "Utilisateur",
    "admin-groupe": "Admin-Groupe",
    "admin-conseil": "Admin-Conseil",
    "super-admin": "Super-Admin",
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Prénom *</label>
          <input type="text" value={form.firstName ?? ""} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
          <input type="text" value={form.lastName ?? ""} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
        <input type="email" value={form.email ?? ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Téléphone</label>
        <input type="text" value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Rôle</label>
          <select value={form.role ?? "utilisateur"} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as User["role"] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {roles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Type de compte</label>
          <select value={form.hasAccount ? "true" : "false"} onChange={(e) => setForm((f) => ({ ...f, hasAccount: e.target.value === "true" }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="true">Autonome</option>
            <option value="false">Sous-tutelle</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Dispenses et obligations</label>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { key: "dispense" as const, label: "Dispense de paiement" },
            { key: "justificatif" as const, label: "Justificatif requis" },
            { key: "caution" as const, label: "Caution requise" },
          ]).map(({ key, label }) => (
            <label key={key} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${
              form.exemptions?.[key] ? "border-blue-300 bg-blue-50" : "border-gray-200"
            }`}>
              <input
                type="checkbox"
                checked={form.exemptions?.[key] ?? false}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  exemptions: { ...f.exemptions, association: f.exemptions?.association ?? false, social: f.exemptions?.social ?? false, elected: f.exemptions?.elected ?? false, dispense: f.exemptions?.dispense ?? false, justificatif: f.exemptions?.justificatif ?? false, caution: f.exemptions?.caution ?? false, [key]: e.target.checked },
                }))}
                className="w-3.5 h-3.5 text-blue-600 rounded"
              />
              <span className="text-xs font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
