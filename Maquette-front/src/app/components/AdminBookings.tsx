import { useState } from "react";
import { useOutletContext, Link } from "react-router";
import { mockBookings, mockResources, mockUsers, Booking } from "../data/mockData";
import { FileText, Calendar, CheckCircle, Clock, XCircle, Filter, ArrowLeft, AlertCircle, User } from "lucide-react";

export function AdminBookings() {
  const { currentUser } = useOutletContext<any>();
  const [bookings, setBookings] = useState(mockBookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!currentUser || (currentUser.role !== "super-admin" && currentUser.role !== "admin-conseil")) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Accès réservé aux administrateurs</p>
        <Link to="/" className="text-blue-900 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const filteredBookings =
    statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter);

  const handleValidate = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "approved" as const } : b));
  };

  const handleReject = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "rejected" as const } : b));
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3" />Validée</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold"><Clock className="w-3 h-3" />En attente</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold"><XCircle className="w-3 h-3" />Refusée</span>;
      case "completed":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3" />Terminée</span>;
    }
  };

  const getPaymentBadge = (status: Booking["paymentStatus"]) => {
    switch (status) {
      case "paid": return <span className="text-xs text-green-700 font-semibold">✓ Payé</span>;
      case "required": return <span className="text-xs text-orange-700 font-semibold">⚠ À payer</span>;
      case "exempt": return <span className="text-xs text-blue-700 font-semibold">Exonéré</span>;
      default: return null;
    }
  };

  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Gestion des réservations</h1>
            <p className="text-gray-600 text-sm">Validez ou refusez les demandes de réservation</p>
          </div>
          {pending > 0 && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              {pending} en attente
            </span>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-5">
        <div className="flex items-center gap-3">
          <Filter className="text-gray-400 w-4 h-4" />
          <span className="text-sm font-semibold">Filtrer :</span>
          <div className="flex gap-2">
            {[
              { value: "all", label: "Toutes" },
              { value: "pending", label: "En attente" },
              { value: "approved", label: "Validées" },
              { value: "rejected", label: "Refusées" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === value
                    ? value === "pending" ? "bg-orange-600 text-white"
                      : value === "approved" ? "bg-green-600 text-white"
                      : value === "rejected" ? "bg-red-600 text-white"
                      : "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const resource = mockResources.find((r) => r.id === booking.resourceId);
            const user = mockUsers.find((u) => u.id === booking.userId);
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
                <div className="flex gap-4">
                  <img
                    src={resource?.image}
                    alt={resource?.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-sm mb-0.5">{resource?.name}</h3>
                        <p className="text-xs text-gray-500">
                          Réservation #{booking.id} · Créée le {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-2">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <User className="w-3.5 h-3.5 text-blue-900" />
                        <span className="text-xs font-semibold">{user?.firstName} {user?.lastName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-900" />
                        <span className="text-xs">
                          {new Date(booking.startDate).toLocaleDateString("fr-FR")} → {new Date(booking.endDate).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-900" />
                        {getPaymentBadge(booking.paymentStatus)}
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-gray-500 italic mb-2 bg-gray-50 rounded px-2 py-1">"{booking.notes}"</p>
                    )}

                    <div className="flex items-center justify-between">
                      <Link
                        to={`/booking-detail/${booking.id}`}
                        className="text-xs text-blue-900 hover:underline font-medium"
                      >
                        Voir les détails →
                      </Link>
                      {booking.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleValidate(booking.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-xs"
                          >
                            Valider
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-xs"
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold mb-1">Aucune réservation trouvée</h3>
          <p className="text-gray-500 text-sm">Aucune réservation ne correspond à ce filtre</p>
        </div>
      )}
    </div>
  );
}
