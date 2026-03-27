import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Building,
  Users as UsersIcon,
  CreditCard,
  Shield,
  Loader2
} from "lucide-react";
import { reservationService } from "@/services/reservationService";
import { Reservation } from "@/types";

export function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!bookingId) return;
      
      try {
        const data = await reservationService.getById(bookingId);
        setReservation(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement de la réservation");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservation();
  }, [bookingId]);

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

  if (error || !reservation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Réservation non trouvée</h1>
          <p className="text-gray-600 mb-6">{error || "La réservation que vous cherchez n'existe pas."}</p>
          <Link 
            to="/my-bookings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à mes réservations
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "CONFIRMEE":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Validée
          </div>
        );
      case "EN_ATTENTE":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            En attente de validation
          </div>
        );
      case "ANNULEE":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Refusée
          </div>
        );
      case "TERMINEE":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Terminée
          </div>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">Payé</span>
          </div>
        );
      case "required":
        return (
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">À régler</span>
          </div>
        );
      case "exempt":
        return (
          <div className="flex items-center gap-2 text-blue-700">
            <Shield className="w-4 h-4" />
            <span className="font-semibold">Exonéré</span>
          </div>
        );
      default:
        return null;
    }
  };

  const calculateDays = () => {
    const start = new Date(reservation.date_debut);
    const end = new Date(reservation.date_fin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/my-bookings"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mes réservations
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Détail de la réservation</h1>
            <p className="text-gray-600">
              Réservation #{reservation.id_reservation}
              {reservation.created_at && " • Créée le " + new Date(reservation.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
          {getStatusBadge(reservation.statut)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ressource */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              <img
                src={reservation.bien?.imageUrl || "/placeholder-property.jpg"}
                alt={reservation.bien?.nom}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-900 text-white">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {reservation.bien?.nom_cat_bien || 'Bien'}
                  </span>
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{reservation.bien?.nom}</h2>
              <p className="text-gray-600 mb-4">{reservation.bien?.description}</p>
            </div>
          </div>

          {/* Dates et détails */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-6">Détails de la réservation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-900 mt-0.5" />
                  <div>
                    <p className="font-semibold">Date de début</p>
                    <p className="text-gray-600">
                      {new Date(reservation.date_debut).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-900 mt-0.5" />
                  <div>
                    <p className="font-semibold">Date de fin</p>
                    <p className="text-gray-600">
                      {new Date(reservation.date_fin).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-900 mt-0.5" />
                  <div>
                    <p className="font-semibold">Durée</p>
                    <p className="text-gray-600">{calculateDays()} jour(s)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-900 mt-0.5" />
                  <div>
                    <p className="font-semibold">Demandeur</p>
                    <p className="text-gray-600">
                      {reservation.user?.prenom} {reservation.user?.nom}
                    </p>
                    <p className="text-sm text-gray-500">{reservation.user?.email}</p>
                  </div>
                </div>

                {reservation.groupe && (
                  <div className="flex items-start gap-3">
                    <UsersIcon className="w-5 h-5 text-blue-900 mt-0.5" />
                    <div>
                      <p className="font-semibold">Groupe</p>
                      <p className="text-gray-600">{reservation.groupe.nom}</p>
                      <p className="text-sm text-gray-500">{reservation.groupe.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statut et paiement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Statut et paiement</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Statut de la réservation</p>
                {getStatusBadge(reservation.statut)}
              </div>

              {reservation.statut_caution && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Statut caution</p>
                  <span className="text-gray-700">{reservation.statut_caution}</span>
                </div>
              )}
            </div>
          </div>

          {/* Durée */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Durée</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-900">{calculateDays()}</p>
              <p className="text-gray-600">jour(s)</p>
            </div>
          </div>

          {/* Informations importantes */}
          {reservation.statut === "EN_ATTENTE" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">En attente de validation</p>
                  <p className="text-sm text-blue-700">
                    Votre demande est en cours d'examen par nos services. 
                    Vous recevrez une réponse par email sous 48h.
                  </p>
                </div>
              </div>
            </div>
          )}

          {reservation.statut === "ANNULEE" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 mb-1">Réservation annulée</p>
                  <p className="text-sm text-red-700">
                    Cette réservation a été annulée. 
                    Vous pouvez contacter le service administratif pour plus d'informations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
