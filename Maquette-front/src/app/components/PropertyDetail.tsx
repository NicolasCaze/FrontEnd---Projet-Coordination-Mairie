import { useParams, Link, useOutletContext } from "react-router";
import { mockResources } from "../data/mockData";
import { 
  Building, 
  Wrench, 
  Users, 
  Calendar, 
  ArrowLeft, 
  MapPin,
  Clock,
  CheckCircle,
  XCircle
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
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image principale */}
          <div className="lg:w-2/3">
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
              <div className="absolute bottom-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  resource.available
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}>
                  {resource.available ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Disponible
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Non disponible
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="lg:w-1/3">
            <h1 className="text-3xl font-bold mb-4">{resource.name}</h1>
            
            {currentUser && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                {/* Capacité */}
                {resource.type !== "room" && resource.capacity && (
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold">Capacité</p>
                      <p className="text-gray-600">{resource.capacity} personnes</p>
                    </div>
                  </div>
                )}

                {/* Prix */}
                {resource.pricePerDay && (
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold">Tarif</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {resource.pricePerDay}€
                        <span className="text-sm text-gray-600 font-normal"> / jour</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Disponibilité */}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold">Statut</p>
                    <p className={resource.available ? "text-green-600" : "text-red-600"}>
                      {resource.available ? "Disponible" : "Non disponible"}
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

      {/* Description détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {resource.description}
            </p>
            
            {/* Caractéristiques supplémentaires */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resource.type === "room" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-blue-900" />
                      <span>Type: Salle</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-green-600" />
                      <span>Type: Matériel</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>Localisation: Mairie</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations complémentaires */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Informations pratiques</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Conditions de réservation</p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Réservation anticipée: 48h minimum</li>
                  <li>• Annulation: 24h avant l'événement</li>
                  <li>• Caution requise selon le type de ressource</li>
                </ul>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Contact</p>
                <p className="text-gray-600 text-sm">
                  Pour toute question, contactez le service technique au<br />
                  <span className="text-blue-900">04 50 00 00 00</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
