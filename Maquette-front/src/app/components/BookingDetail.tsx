import { useParams, Link } from "react-router";
import { mockBookings, mockResources, mockUsers, mockGroups } from "../data/mockData";
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
  Shield
} from "lucide-react";

export function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  
  const booking = mockBookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Réservation non trouvée</h1>
          <p className="text-gray-600 mb-6">La réservation que vous cherchez n'existe pas.</p>
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

  const resource = mockResources.find(r => r.id === booking.resourceId);
  const user = mockUsers.find(u => u.id === booking.userId);
  const group = booking.groupId ? mockGroups.find(g => g.id === booking.groupId) : null;

  const getStatusBadge = (status: typeof booking.status) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Validée
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" />
            En attente de validation
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Refusée
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Terminée
          </div>
        );
    }
  };

  const getPaymentBadge = (status: typeof booking.paymentStatus) => {
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
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateTotal = () => {
    if (!resource?.pricePerDay) return 0;
    return resource.pricePerDay * calculateDays();
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
              Réservation #{booking.id} • Créée le {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ressource */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              <img
                src={resource?.image}
                alt={resource?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  resource?.type === "room"
                    ? "bg-blue-900 text-white"
                    : "bg-green-600 text-white"
                }`}>
                  {resource?.type === "room" ? (
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      Salle
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Matériel
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{resource?.name}</h2>
              <p className="text-gray-600 mb-4">{resource?.description}</p>
              
              {resource?.capacity && (
                <div className="flex items-center gap-2 text-gray-700">
                  <UsersIcon className="w-5 h-5" />
                  <span>Capacité: {resource.capacity} personnes</span>
                </div>
              )}
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
                      {new Date(booking.startDate).toLocaleDateString("fr-FR", {
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
                      {new Date(booking.endDate).toLocaleDateString("fr-FR", {
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
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {group && (
                  <div className="flex items-start gap-3">
                    <UsersIcon className="w-5 h-5 text-blue-900 mt-0.5" />
                    <div>
                      <p className="font-semibold">Groupe</p>
                      <p className="text-gray-600">{group.name}</p>
                      <p className="text-sm text-gray-500">{group.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold mb-2">Notes</p>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          {booking.attachments && booking.attachments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Documents joints</h3>
              <div className="space-y-3">
                {booking.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{attachment.fileName}</p>
                        <p className="text-sm text-gray-500">
                          Ajouté le {new Date(attachment.uploadDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-blue-900 hover:text-blue-800 transition">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statut et paiement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Statut et paiement</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Statut de la réservation</p>
                {getStatusBadge(booking.status)}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Statut du paiement</p>
                {getPaymentBadge(booking.paymentStatus)}
              </div>

              {booking.depositStatus && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Caution</p>
                  {getPaymentBadge(booking.depositStatus)}
                </div>
              )}
            </div>
          </div>

          {/* Coût */}
          {resource?.pricePerDay && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Coût total</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarif journalier</span>
                  <span className="font-semibold">{resource.pricePerDay}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre de jours</span>
                  <span className="font-semibold">{calculateDays()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-blue-900">{calculateTotal()}€</span>
                  </div>
                </div>
              </div>

              {booking.paymentStatus === "required" && (
                <button className="w-full mt-4 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payer maintenant
                </button>
              )}
            </div>
          )}

          {/* Informations importantes */}
          {booking.status === "pending" && (
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

          {booking.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 mb-1">Réservation refusée</p>
                  <p className="text-sm text-red-700">
                    Votre demande de réservation n'a pas pu être validée. 
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
