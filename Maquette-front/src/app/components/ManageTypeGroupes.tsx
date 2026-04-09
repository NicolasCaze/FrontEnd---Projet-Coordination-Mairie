import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AlertCircle, Plus, X, Edit, Trash2, Loader2, Tag } from "lucide-react";
import { typeGroupeService, TypeGroupe } from "@/services/typeGroupeService";
import { useAuth } from "@/contexts/AuthContext";

export function ManageTypeGroupes() {
  const { user } = useAuth();
  const [typeGroupes, setTypeGroupes] = useState<TypeGroupe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<TypeGroupe | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTypeGroupes();
  }, []);

  const fetchTypeGroupes = async () => {
    try {
      const data = await typeGroupeService.getAll();
      setTypeGroupes(data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des types de groupes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingType) {
        await typeGroupeService.update(editingType.id_type_groupe, formData);
        alert("Type de groupe modifié avec succès !");
      } else {
        await typeGroupeService.create(formData);
        alert("Type de groupe créé avec succès !");
      }
      
      await fetchTypeGroupes();
      setShowForm(false);
      setEditingType(null);
      setFormData({ nom: "", description: "" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (typeGroupe: TypeGroupe) => {
    setEditingType(typeGroupe);
    setFormData({
      nom: typeGroupe.nom,
      description: typeGroupe.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce type de groupe ?")) return;

    try {
      await typeGroupeService.delete(id);
      await fetchTypeGroupes();
      alert("Type de groupe supprimé avec succès !");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingType(null);
    setFormData({ nom: "", description: "" });
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestion des types de groupes</h1>
          <p className="text-gray-600 text-sm">Créer et gérer les catégories de groupes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Créer un type
        </button>
      </div>

      {/* Modal de création/modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingType ? "Modifier le type de groupe" : "Créer un type de groupe"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Association, Club sportif..."
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Description du type de groupe..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingType ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des types de groupes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {typeGroupes.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun type de groupe créé</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-purple-600 hover:underline font-semibold"
            >
              Créer le premier type de groupe
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {typeGroupes.map((type) => (
                  <tr key={type.id_type_groupe} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">{type.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {type.description || <span className="text-gray-400 italic">Aucune description</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-3 h-3" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(type.id_type_groupe)}
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
        )}
      </div>
    </div>
  );
}
