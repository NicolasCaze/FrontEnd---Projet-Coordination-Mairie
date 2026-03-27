import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, AlertCircle, Loader2 } from "lucide-react";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";
import { Groupe } from "@/types";

export function AdminGroups() {
  const { user } = useAuth();
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const data = await groupeService.getAll();
        setGroupes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === "ADMIN") {
      fetchGroupes();
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Gestion des groupes</h1>
        <p className="text-gray-600 text-sm">Liste de tous les groupes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Membres</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupes.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{g.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {groupes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun groupe trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
