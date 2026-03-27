import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Building, Wrench, Users, Filter, Loader2 } from "lucide-react";
import { bienService } from "@/services/bienService";
import { Bien } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function Catalog() {
  const { user } = useAuth();
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [appliedType, setAppliedType] = useState<string>("all");

  useEffect(() => {
    fetchBiens();
  }, []);

  const fetchBiens = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bienService.getAll({ disponible: true });
      setBiens(response.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du chargement des biens");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setAppliedType(typeFilter);
  };

  const handleReset = () => {
    setTypeFilter("all");
    setAppliedType("all");
  };

  const filteredResources = biens.filter((bien) => {
    const matchesType = appliedType === "all" || bien.type === appliedType;
    return matchesType;
  });

  const isFiltered = appliedType !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du catalogue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Catalogue des ressources</h1>
        <p className="text-gray-600 text-sm">
          Découvrez toutes les salles et matériels disponibles à la réservation
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Type de ressource
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ResourceType | "all")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tous les types</option>
              <option value="salle">Salles</option>
              <option value="materiel">Matériel</option>
              <option value="vehicule">Véhicules</option>
              <option value="equipement">Équipement</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleFilter}
            className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Filtrer
          </button>
          {isFiltered && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredResources.length} ressource{filteredResources.length > 1 ? "s" : ""} trouvée{filteredResources.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((bien) => (
          <div
            key={bien.id_bien}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group flex flex-col"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={bien.imageUrl || "/placeholder-property.jpg"}
                alt={bien.nom}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 bg-blue-900 text-white">
                  <Building className="w-4 h-4" />
                  {bien.nom_cat_bien || bien.type || 'Bien'}
                </span>
              </div>
              {!bien.estVisible && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                    Non disponible
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              {/* Partie 1 — titre + description */}
              <div>
                <h3 className="text-base font-bold mb-1">{bien.nom}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bien.description || "Aucune description disponible"}</p>
              </div>

              {/* Partie 2 — infos (capacité, prix) */}
              <div className="flex-1 flex flex-col">
                {bien.capacite && (
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Users className="w-5 h-5" />
                    <span>Capacité: {bien.capacite} personnes</span>
                  </div>
                )}
                {bien.adresse && (
                  <div className="text-sm text-gray-600 mb-2">
                    📍 {bien.adresse}
                  </div>
                )}
              </div>

              {/* Partie 3 — boutons */}
              <div className="space-y-2 mt-3">
                <Link
                  to={`/property/${bien.id_bien}`}
                  className="block w-full text-center py-1.5 rounded-lg text-sm font-semibold transition border border-blue-900 text-blue-900 hover:bg-blue-50"
                >
                  Voir les détails
                </Link>
                {user && (
                  <Link
                    to={`/booking/${bien.id_bien}`}
                    className={`block w-full text-center py-2 rounded-lg text-sm font-semibold transition ${
                      bien.estVisible
                        ? "bg-blue-900 text-white hover:bg-blue-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    Réserver
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Aucune ressource trouvée avec ces critères</p>
        </div>
      )}
    </div>
  );
}
