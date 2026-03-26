import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { mockResources, mockGroups } from "../data/mockData";
import { Calendar, Upload, Users, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export function BookingForm() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const resource = mockResources.find((r) => r.id === resourceId);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    groupId: "",
    notes: "",
    hasAccount: false,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  if (!resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Ressource introuvable</p>
          <Link to="/catalog" className="text-blue-900 hover:underline mt-4 inline-block">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the backend
    setSubmitted(true);
    setTimeout(() => {
      navigate("/catalog");
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Demande de réservation envoyée !</h2>
          <p className="text-gray-700 mb-6">
            Votre demande a été transmise à nos services. Vous recevrez une confirmation par email
            dans les plus brefs délais.
          </p>
          <p className="text-sm text-gray-600">Redirection vers le catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-blue-900 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au catalogue
      </Link>

      {/* Resource Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex gap-6">
          <img
            src={resource.image}
            alt={resource.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{resource.name}</h1>
            <p className="text-gray-600 mb-3">{resource.description}</p>
            <div className="flex items-center gap-4">
              {resource.type !== "room" && resource.capacity && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5" />
                  <span>{resource.capacity} personnes</span>
                </div>
              )}
              <div className="text-xl font-bold text-blue-900">
                {resource.pricePerDay}€ / jour
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Réservation possible sans compte
            </h3>
            <p className="text-sm text-blue-800">
              Vous pouvez effectuer une réservation sans créer de compte. Cependant, créer un compte
              vous permettra de suivre vos réservations et d'accélérer vos futures demandes.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-6">Formulaire de réservation</h2>

        {/* Account toggle */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasAccount}
              onChange={(e) => setFormData({ ...formData, hasAccount: e.target.checked })}
              className="w-5 h-5 text-blue-900 rounded"
            />
            <span className="font-semibold">Je possède un compte et je souhaite me connecter</span>
          </label>
          {formData.hasAccount && (
            <Link to="/login" className="text-blue-900 hover:underline mt-2 inline-block text-sm">
              → Aller à la page de connexion
            </Link>
          )}
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Prénom *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Nom *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Téléphone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Dates de réservation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date de début *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Date de fin *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Group/Organization */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Organisation (optionnel)</h3>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Réservation au nom d'un groupe ou d'une association
            </label>
            <select
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Réservation individuelle --</option>
              {mockGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2">
            Informations complémentaires
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Décrivez votre événement, besoins spécifiques..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* File Upload */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Pièces justificatives (optionnel)
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Justificatifs d'association, attestations, etc.
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {files.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold mb-2">Fichiers sélectionnés :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {files.map((file, index) => (
                  <li key={index}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Envoyer la demande
          </button>
          <Link
            to="/catalog"
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Annuler
          </Link>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          * Champs obligatoires. Vos données sont traitées conformément au RGPD.
        </p>
      </form>
    </div>
  );
}
