import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Edit, Trash2, AlertCircle, Loader2, Users as UsersIcon, UserCog, Tag, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Groupe, User } from "@/types";
import { groupeService } from "@/services/groupeService";
import { userService } from "@/services/userService";
import { typeGroupeService, TypeGroupe } from "@/services/typeGroupeService";
import api from "@/lib/api";

export function ManageGroupes() {
  const { user } = useAuth();
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typeGroupes, setTypeGroupes] = useState<TypeGroupe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGroupe, setEditingGroupe] = useState<Groupe | null>(null);
  const [searchUser, setSearchUser] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type_groupe: "",
    adminUserId: ""
  });

  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [groupesResponse, usersResponse, typeGroupesResponse] = await Promise.all([
        groupeService.getAll(),
        userService.getAll({}),
        typeGroupeService.getAll()
      ]);
      setGroupes(groupesResponse.content);
      setUsers(usersResponse.content);
      setTypeGroupes(typeGroupesResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mapper le type de groupe vers l'enum du backend
      // Par défaut, utiliser ASSOCIATION pour les types personnalisés
      const typeGroupeEnum = ["ASSOCIATION", "CONSEIL_MUNICIPAL", "ENTREPRISE", "PARTICULIER"].includes(formData.type_groupe.toUpperCase())
        ? formData.type_groupe.toUpperCase()
        : "ASSOCIATION";
      
      const payload = {
        nom: formData.nom,
        description: formData.description,
        type_groupe: typeGroupeEnum
      };

      let groupeId: string;
      if (editingGroupe) {
        await api.put(`/groupes/${editingGroupe.id_groupe}`, payload);
        groupeId = editingGroupe.id_groupe;
      } else {
        const response = await api.post<Groupe>("/groupes", payload);
        groupeId = response.data.id_groupe;
      }

      // Si un admin de groupe est sélectionné, l'assigner
      if (formData.adminUserId && groupeId) {
        try {
          await api.post(`/groupes/${groupeId}/members`, {
            userId: formData.adminUserId,
            roleGroupe: "ADMIN"
          });
          alert("Groupe créé avec succès et admin assigné !");
        } catch (err: any) {
          console.error("Erreur lors de l'assignation de l'admin:", err);
          const errorMsg = err.response?.data?.message || "Erreur lors de l'assignation de l'admin";
          alert(`Groupe créé mais erreur lors de l'assignation de l'admin: ${errorMsg}`);
        }
      } else {
        alert("Groupe créé avec succès !");
      }

      setShowForm(false);
      setEditingGroupe(null);
      setSearchUser(""); // Réinitialiser la recherche
      setFormData({ nom: "", description: "", type_groupe: "", adminUserId: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (groupe: Groupe) => {
    setEditingGroupe(groupe);
    setSearchUser(""); // Réinitialiser la recherche
    // Trouver l'admin actuel du groupe
    const adminMembre = groupe.membres?.find(m => m.roleGroupe === "ADMIN");
    setFormData({
      nom: groupe.nom,
      description: groupe.description || "",
      type_groupe: groupe.type_groupe || "",
      adminUserId: adminMembre?.id_user || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce groupe ?")) return;
    try {
      await api.delete(`/groupes/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Accès réservé aux administrateurs</p>
        <Link to="/" className="text-blue-900 hover:underline">Retour à l'accueil</Link>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestion des groupes</h1>
          <p className="text-gray-600 text-sm">Créer des groupes et assigner des administrateurs de groupe</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/manage-type-groupes"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Tag className="w-4 h-4" />
            Gérer les types
          </Link>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingGroupe(null);
              setSearchUser(""); // Réinitialiser la recherche
              setFormData({ nom: "", description: "", type_groupe: "", adminUserId: "" });
            }}
            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            Créer un groupe
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">
            {editingGroupe ? "Modifier le groupe" : "Nouveau groupe"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du groupe *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Association des parents d'élèves"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description du groupe..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de groupe
              </label>
              <select
                value={formData.type_groupe}
                onChange={(e) => setFormData({ ...formData, type_groupe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un type</option>
                {typeGroupes.map((type) => (
                  <option key={type.id_type_groupe} value={type.nom}>
                    {type.nom}
                  </option>
                ))}
              </select>
              {typeGroupes.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Aucun type de groupe disponible. <Link to="/admin/manage-type-groupes" className="underline">Créer un type</Link>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <UserCog className="w-4 h-4" />
                  Administrateur du groupe (optionnel)
                </div>
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={formData.adminUserId}
                onChange={(e) => setFormData({ ...formData, adminUserId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                size={5}
              >
                <option value="">Aucun (à assigner plus tard)</option>
                {users
                  .filter(u => u.role === "USER")
                  .filter(u => {
                    if (!searchUser) return true;
                    const search = searchUser.toLowerCase();
                    return (
                      u.nom.toLowerCase().includes(search) ||
                      u.prenom.toLowerCase().includes(search) ||
                      u.email.toLowerCase().includes(search)
                    );
                  })
                  .map((u) => (
                    <option key={u.id_user} value={u.id_user}>
                      {u.prenom} {u.nom} ({u.email})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                L'admin de groupe pourra gérer les membres et envoyer des invitations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition"
              >
                {editingGroupe ? "Mettre à jour" : "Créer le groupe"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGroupe(null);
                  setSearchUser(""); // Réinitialiser la recherche
                  setFormData({ nom: "", description: "", type_groupe: "", adminUserId: "" });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Groupe</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Membres</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupes.map((groupe) => (
                <tr key={groupe.id_groupe} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{groupe.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {groupe.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {groupe.type_groupe || "Non défini"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600">
                        {groupe.membres?.length || 0} membre(s)
                      </span>
                      {groupe.membres?.find(m => m.roleGroupe === "ADMIN") && (
                        <div className="flex items-center gap-1 text-xs text-amber-700">
                          <UserCog className="w-3 h-3" />
                          <span>
                            Admin: {groupe.membres.find(m => m.roleGroupe === "ADMIN")?.prenom} {groupe.membres.find(m => m.roleGroupe === "ADMIN")?.nom}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(groupe)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-3 h-3" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(groupe.id_groupe)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {groupes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun groupe trouvé</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-700 hover:underline text-sm"
            >
              Créer le premier groupe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
