import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Edit, Trash2, AlertCircle, Loader2, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Bien } from "@/types";
import api from "@/lib/api";

export function ManageBiens() {
  const { user } = useAuth();
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBien, setEditingBien] = useState<Bien | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    estVisible: true,
    id_cat_bien: "",
    tarif: {
      niveau_1: 0,
      niveau_2: 0,
      niveau_3: 0,
      niveau_4: 0,
      niveau_5: 0
    }
  });

  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      fetchBiens();
    }
  }, [user]);

  const fetchBiens = async () => {
    try {
      const response = await api.get<{ content: Bien[] }>("/biens");
      setBiens(response.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBien) {
        await api.put(`/biens/${editingBien.id_bien}`, formData);
      } else {
        await api.post("/biens", formData);
      }
      setShowForm(false);
      setEditingBien(null);
      setFormData({ nom: "", description: "", estVisible: true, id_cat_bien: "", tarif: { niveau_1: 0, niveau_2: 0, niveau_3: 0, niveau_4: 0, niveau_5: 0 } });
      fetchBiens();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (bien: Bien) => {
    setEditingBien(bien);
    setFormData({
      nom: bien.nom,
      description: bien.description || "",
      estVisible: bien.estVisible,
      id_cat_bien: bien.id_cat_bien || "",
      tarif: bien.tarif || { niveau_1: 0, niveau_2: 0, niveau_3: 0, niveau_4: 0, niveau_5: 0 }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce bien ?")) return;
    try {
      await api.delete(`/biens/${id}`);
      fetchBiens();
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
          <h1 className="text-2xl font-bold mb-1">Gestion des biens</h1>
          <p className="text-gray-600 text-sm">Créer et gérer les salles et équipements</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBien(null);
            setFormData({ nom: "", description: "", estVisible: true, id_cat_bien: "", tarif: { niveau_1: 0, niveau_2: 0, niveau_3: 0, niveau_4: 0, niveau_5: 0 } });
          }}
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">
            {editingBien ? "Modifier le bien" : "Nouveau bien"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du bien *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              />
            </div>

            {/* Section Tarification */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tarification (€)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Niveau 1 - Membre individuel
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tarif.niveau_1}
                    onChange={(e) => setFormData({ ...formData, tarif: { ...formData.tarif, niveau_1: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Niveau 2 - Association
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tarif.niveau_2}
                    onChange={(e) => setFormData({ ...formData, tarif: { ...formData.tarif, niveau_2: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Niveau 3 - Groupe sportif
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tarif.niveau_3}
                    onChange={(e) => setFormData({ ...formData, tarif: { ...formData.tarif, niveau_3: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Niveau 4 - Entreprise
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tarif.niveau_4}
                    onChange={(e) => setFormData({ ...formData, tarif: { ...formData.tarif, niveau_4: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Niveau 5 - Conseil municipal
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tarif.niveau_5}
                    onChange={(e) => setFormData({ ...formData, tarif: { ...formData.tarif, niveau_5: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="estVisible"
                checked={formData.estVisible}
                onChange={(e) => setFormData({ ...formData, estVisible: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="estVisible" className="text-sm font-medium text-gray-700">
                Visible dans le catalogue
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition"
              >
                {editingBien ? "Mettre à jour" : "Créer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBien(null);
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Bien</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Visibilité</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {biens.map((bien) => (
                <tr key={bien.id_bien} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{bien.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {bien.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      bien.estVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bien.estVisible ? 'Visible' : 'Masqué'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(bien)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-3 h-3" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(bien.id_bien)}
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
        {biens.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun bien trouvé</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-700 hover:underline text-sm"
            >
              Créer le premier bien
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
