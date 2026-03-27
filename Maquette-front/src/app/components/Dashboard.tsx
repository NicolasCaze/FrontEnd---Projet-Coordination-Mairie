import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Calendar, FileText, Users, Award, Clock, Loader2 } from "lucide-react";
import { reservationService } from "@/services/reservationService";
import { useAuth } from "@/contexts/AuthContext";
import { Reservation } from "@/types";

export function Dashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      try {
        const response = await reservationService.getMyReservations({});
        setReservations(response.content || response || []);
      } catch (err) {
        console.error(err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Veuillez vous connecter pour accéder à votre tableau de bord</p>
          <Link to="/login" className="text-blue-900 hover:underline">Se connecter</Link>
        </div>
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

  const activeReservations = reservations.filter(r => r.statut === "CONFIRMEE");
  const pendingReservations = reservations.filter(r => r.statut === "EN_ATTENTE");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Bienvenue, {user.prenom} !</h1>
        <p className="text-gray-600 text-sm">Gérez vos réservations et votre profil</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Réservations actives</p>
              <p className="text-2xl font-bold text-blue-900">
                {activeReservations.length}
              </p>
            </div>
            <div className="bg-blue-100 w-9 h-9 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-900" />
            </div>
          </div>
          <Link to="/my-bookings" className="text-xs text-blue-700 hover:underline">
            Voir la liste →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">En attente</p>
              <p className="text-2xl font-bold text-orange-600">
                {pendingReservations.length}
              </p>
            </div>
            <div className="bg-orange-100 w-9 h-9 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <Link to="/my-bookings" className="text-xs text-blue-700 hover:underline">
            Voir la liste →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total réservations</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
            <div className="bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-gray-900" />
            </div>
          </div>
          <Link to="/my-bookings" className="text-xs text-blue-700 hover:underline">
            Voir la liste →
          </Link>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link
          to="/catalog"
          className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-xl p-5 hover:shadow-lg transition group"
        >
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="text-base font-bold mb-1">Nouvelle réservation</h3>
          <p className="text-blue-100 text-sm mb-3">
            Consultez notre catalogue et réservez une salle ou du matériel
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Voir le catalogue →
          </span>
        </Link>

        <Link
          to="/my-groups"
          className="bg-gradient-to-br from-purple-700 to-purple-500 text-white rounded-xl p-5 hover:shadow-lg transition group"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-base font-bold mb-1">Mes groupes</h3>
          <p className="text-purple-100 text-sm mb-3">
            Consultez vos groupes ou rejoignez-en un nouveau avec un code
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
            Voir mes groupes →
          </span>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-base font-bold mb-4">Réservations récentes</h2>
        {reservations.length > 0 ? (
          <div className="space-y-3">
            {reservations.slice(0, 3).map((reservation) => {
              return (
                <div
                  key={reservation.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <img
                    src={reservation.bien?.imageUrl || "/placeholder-property.jpg"}
                    alt={reservation.bien?.nom}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-0.5">{reservation.bien?.nom || "Bien supprimé"}</h4>
                    <p className="text-xs text-gray-600">
                      Du {new Date(reservation.dateDebut).toLocaleDateString("fr-FR")} au{" "}
                      {new Date(reservation.dateFin).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reservation.statut === "CONFIRMEE"
                        ? "bg-green-100 text-green-800"
                        : reservation.statut === "EN_ATTENTE"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reservation.statut === "CONFIRMEE" ? "Validée" : reservation.statut === "EN_ATTENTE" ? "En attente" : "Annulée"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Vous n'avez pas encore de réservation</p>
            <Link to="/catalog" className="text-blue-900 hover:underline mt-1 inline-block text-sm">
              Faire une réservation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
