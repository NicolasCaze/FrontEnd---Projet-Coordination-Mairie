import { useState } from "react";
import { Link, useOutletContext } from "react-router";
import { mockResources, mockBookings, ResourceType } from "../data/mockData";
import { Building, Wrench, Users, Filter } from "lucide-react";

export function Catalog() {
  const { currentUser } = useOutletContext<any>();
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");

  const [appliedType, setAppliedType] = useState<ResourceType | "all">("all");

  const handleFilter = () => {
    setAppliedType(typeFilter);
  };

  const handleReset = () => {
    setTypeFilter("all");
    setAppliedType("all");
  };

  const filteredResources = mockResources.filter((resource) => {
    const matchesType = appliedType === "all" || resource.type === appliedType;
    return matchesType;
  });

  const isFiltered = appliedType !== "all";

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
              <option value="room">Salles</option>
              <option value="equipment">Matériel</option>
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
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group flex flex-col"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={resource.image}
                alt={resource.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 ${
                  resource.type === "room"
                    ? "bg-blue-900 text-white"
                    : "bg-green-600 text-white"
                }`}>
                  {resource.type === "room" ? (
                    <>
                      <Building className="w-4 h-4" />
                      Salle
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      Matériel
                    </>
                  )}
                </span>
              </div>
              {!resource.available && (
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
                <h3 className="text-base font-bold mb-1">{resource.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
              </div>

              {/* Partie 2 — infos (capacité, prix) */}
              <div className="flex-1 flex flex-col">
                {resource.type !== "room" && resource.capacity && (
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Users className="w-5 h-5" />
                    <span>Capacité: {resource.capacity} personnes</span>
                  </div>
                )}
                {currentUser && (
                  <div className="mt-auto pt-2 text-right">
                    <span className="text-lg font-bold text-blue-900">
                      {resource.pricePerDay}€
                    </span>
                    <span className="text-gray-600 text-sm"> / jour</span>
                  </div>
                )}
              </div>

              {/* Partie 3 — boutons */}
              <div className="space-y-2 mt-3">
                <Link
                  to={`/property/${resource.id}`}
                  className="block w-full text-center py-1.5 rounded-lg text-sm font-semibold transition border border-blue-900 text-blue-900 hover:bg-blue-50"
                >
                  Voir les détails
                </Link>
                {currentUser && (
                  <Link
                    to={`/booking/${resource.id}`}
                    className={`block w-full text-center py-2 rounded-lg text-sm font-semibold transition ${
                      resource.available
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
