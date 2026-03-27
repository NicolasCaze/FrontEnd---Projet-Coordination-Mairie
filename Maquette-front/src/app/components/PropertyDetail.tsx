import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { 
  Building, 
  Wrench, 
  Users, 
  Calendar, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { bienService } from "@/services/bienService";
import { Bien } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export function PropertyDetail() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { user } = useAuth();
  const [bien, setBien] = useState<Bien | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBien = async () => {
      if (!resourceId) return;
      
      try {
        setLoading(true);
        const data = await bienService.getById(resourceId);
        setBien(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement du bien");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBien();
  }, [resourceId]);

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

  if (error || !bien) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bien non trouvé</h1>
          <p className="text-gray-600 mb-6">{error || "Le bien que vous cherchez n'existe pas."}</p>
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

  const resource = bien;


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
                src={resource.imageUrl || "/placeholder-property.jpg"}
                alt={resource.nom}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-blue-900 text-white">
                  <Building className="w-4 h-4" />
                  {resource.nom_cat_bien || resource.type || 'Bien'}
                </span>
              </div>
            </div>
          </div>

          {/* Titre à l'extérieur de la carte */}
          <div>
            <h1 className="text-3xl font-bold mb-6">{resource.nom}</h1>
            
            {/* Carte principale contenant tout le reste */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {resource.description || "Aucune description disponible"}
                </p>
              </div>

              {/* Capacité */}
              {resource.capacite && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold">Capacité</p>
                    <p className="text-gray-600">{resource.capacite} personnes</p>
                  </div>
                </div>
              )}

              {/* Carte séparée pour le tarif */}
              {resource.adresse && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">Adresse</p>
                      <p className="text-gray-600">{resource.adresse}</p>
                    </div>
                  </div>
                </div>
              )}

              {false && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold">Tarif</p>
                      <p className="text-2xl font-bold text-blue-900">
                        Gratuit
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {user ? (
                <Link
                  to={`/booking/${resource.id_bien}`}
                  className={`block w-full text-center py-4 rounded-xl font-semibold transition text-lg ${
                    resource.estVisible
                      ? "bg-blue-900 text-white hover:bg-blue-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  {resource.estVisible ? "Réserver ce bien" : "Indisponible à la réservation"}
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
