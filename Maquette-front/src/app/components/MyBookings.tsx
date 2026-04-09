import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FileText, Calendar, CheckCircle, Clock, XCircle, Filter, ArrowLeft, Loader2 } from "lucide-react";
import { reservationService } from "@/services/reservationService";
import { useAuth } from "@/contexts/AuthContext";
import { Reservation } from "@/types";

export function MyBookings() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const params = statusFilter !== "all" ? { statut: statusFilter.toUpperCase() } : {};
        const response = await reservationService.getMyReservations(params);
        // Gérer le cas où l'API retourne directement un tableau ou un objet paginé
        const reservationsList = Array.isArray(response) ? response : (response.content || []);
        setReservations(reservationsList);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement des réservations");
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchReservations();
    }
  }, [statusFilter, user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            Veuillez vous connecter pour voir vos réservations
          </p>
          <Link to="/login" className="text-blue-900 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "CONFIRMEE":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Validée
          </span>
        );
      case "EN_ATTENTE":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            En attente
          </span>
        );
      case "ANNULEE":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Refusée
          </span>
        );
      case "TERMINEE":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Terminée
          </span>
        );
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette réservation ?")) return;
    
    try {
      await reservationService.cancel(id);
      setReservations(reservations.filter(r => r.id_reservation !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'annulation de la réservation");
    }
  };

  const filteredReservations = statusFilter === "all"
    ? reservations
    : reservations.filter(r => r.statut === statusFilter.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Mes réservations</h1>
        <p className="text-gray-600 text-lg">
          Consultez et gérez toutes vos demandes de réservation
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center gap-4">
          <Filter className="text-gray-400 w-5 h-5" />
          <label className="text-sm font-semibold">Filtrer par statut :</label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "all"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setStatusFilter("EN_ATTENTE")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "EN_ATTENTE"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setStatusFilter("CONFIRMEE")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "CONFIRMEE"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Validées
            </button>
            <button
              onClick={() => setStatusFilter("ANNULEE")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "ANNULEE"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Refusées
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            return (
              <div key={reservation.id_reservation} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex gap-6">
                  {/* Image */}
                  <img
                    src={reservation.bien?.imageUrl || "/placeholder-property.jpg"}
                    alt={reservation.bien?.nom}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{reservation.bien?.nom || "Bien supprimé"}</h3>
                        <p className="text-sm text-gray-600">
                          Réservation #{reservation.id_reservation}
                          {reservation.created_at && " • Créée le " + new Date(reservation.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {getStatusBadge(reservation.statut)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-900" />
                        <div>
                          <p className="text-sm font-semibold">Dates</p>
                          <p className="text-sm">
                            {new Date(reservation.date_debut).toLocaleDateString("fr-FR")} →{" "}
                            {new Date(reservation.date_fin).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      {reservation.nombrePersonnes && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <FileText className="w-5 h-5 text-blue-900" />
                          <div>
                            <p className="text-sm font-semibold">Nombre de personnes</p>
                            <p className="text-sm">{reservation.nombrePersonnes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {reservation.motif && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Motif :</span> {reservation.motif}
                        </p>
                      </div>
                    )}

                    {reservation.statut === "EN_ATTENTE" && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
                        <p className="text-sm text-blue-800">
                          ℹ️ Votre demande est en cours d'examen par nos services. Vous recevrez une
                          réponse par email sous 48h.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Link
                        to={`/booking-detail/${reservation.id_reservation}`}
                        className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium text-sm transition"
                      >
                        Voir les détails
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                      {reservation.statut === "EN_ATTENTE" && (
                        <button
                          onClick={() => handleCancel(reservation.id_reservation)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucune réservation trouvée</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === "all"
              ? "Vous n'avez pas encore effectué de réservation"
              : `Vous n'avez pas de réservation avec ce statut`}
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Faire une réservation
          </Link>
        </div>
      )}
    </div>
  );
}
