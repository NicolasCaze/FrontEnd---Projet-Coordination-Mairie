import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { mockBookings, mockResources, Booking } from "../data/mockData";
import { FileText, Calendar, CheckCircle, Clock, XCircle, Filter, ArrowLeft } from "lucide-react";

export function MyBookings() {
  const { currentUser } = useOutletContext<any>();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!currentUser) {
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

  const userBookings = mockBookings.filter((b) => b.userId === currentUser.id);
  const filteredBookings =
    statusFilter === "all"
      ? userBookings
      : userBookings.filter((b) => b.status === statusFilter);

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Validée
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Refusée
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Terminée
          </span>
        );
    }
  };

  const getPaymentBadge = (status: Booking["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <span className="text-sm text-green-700 font-semibold">✓ Payé</span>;
      case "required":
        return <span className="text-sm text-orange-700 font-semibold">⚠ À payer</span>;
      case "exempt":
        return <span className="text-sm text-blue-700 font-semibold">Exonéré</span>;
      default:
        return null;
    }
  };

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
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "pending"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Validées
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const resource = mockResources.find((r) => r.id === booking.resourceId);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <img
                    src={resource?.image}
                    alt={resource?.name}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{resource?.name}</h3>
                        <p className="text-sm text-gray-600">
                          Réservation #{booking.id} • Créée le{" "}
                          {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-900" />
                        <div>
                          <p className="text-sm font-semibold">Dates</p>
                          <p className="text-sm">
                            {new Date(booking.startDate).toLocaleDateString("fr-FR")} →{" "}
                            {new Date(booking.endDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <FileText className="w-5 h-5 text-blue-900" />
                        <div>
                          <p className="text-sm font-semibold">Paiement</p>
                          <p className="text-sm">{getPaymentBadge(booking.paymentStatus)}</p>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Notes :</span> {booking.notes}
                        </p>
                      </div>
                    )}

                    {booking.status === "pending" && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
                        <p className="text-sm text-blue-800">
                          ℹ️ Votre demande est en cours d'examen par nos services. Vous recevrez une
                          réponse par email sous 48h.
                        </p>
                      </div>
                    )}

                    <Link
                      to={`/booking-detail/${booking.id}`}
                      className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium text-sm transition"
                    >
                      Voir les détails
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
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
              : `Vous n'avez pas de réservation avec le statut "${
                  statusFilter === "pending"
                    ? "En attente"
                    : statusFilter === "approved"
                    ? "Validée"
                    : statusFilter
                }"`}
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
