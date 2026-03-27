import { useParams, Link, useOutletContext } from "react-router";
import { mockResources } from "../data/mockData";
import { 
  Building, 
  Wrench, 
  Users, 
  Calendar, 
  ArrowLeft,
  CheckCircle
} from "lucide-react";

export function PropertyDetail() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { currentUser } = useOutletContext<any>();
  const resource = mockResources.find(r => r.id === resourceId);

  if (!resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ressource non trouvée</h1>
          <p className="text-gray-600 mb-6">La ressource que vous cherchez n'existe pas.</p>
          <Link 
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/catalog"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image principale */}
          <div>
            <div className="relative h-96 rounded-xl overflow-hidden bg-gray-200">
              <img
                src={resource.image}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
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
            </div>
          </div>

          {/* Titre à l'extérieur de la carte */}
          <div>
            <h1 className="text-3xl font-bold mb-6">{resource.name}</h1>
            
            {/* Carte principale contenant tout le reste */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {resource.description}
                </p>
              </div>

              {/* Capacité */}
              {resource.type !== "room" && resource.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold">Capacité</p>
                    <p className="text-gray-600">{resource.capacity} personnes</p>
                  </div>
                </div>
              )}

              {/* Carte séparée pour le tarif */}
              {resource.pricePerDay && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold">Tarif</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {resource.pricePerDay}€
                        <span className="text-sm text-gray-600 font-normal"> / jour</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {currentUser ? (
                <Link
                  to={`/booking/${resource.id}`}
                  className={`block w-full text-center py-4 rounded-xl font-semibold transition text-lg ${
                    resource.available
                      ? "bg-blue-900 text-white hover:bg-blue-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  {resource.available ? "Réserver cette ressource" : "Indisponible à la réservation"}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center py-4 rounded-xl font-semibold transition text-lg border-2 border-blue-900 text-blue-900 hover:bg-blue-50"
                >
                  Connectez-vous pour réserver
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
