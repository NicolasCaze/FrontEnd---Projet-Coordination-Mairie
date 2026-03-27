import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Calendar, Upload, Users, AlertCircle, CheckCircle, ArrowLeft, FileText, X, Loader2 } from "lucide-react";
import { bienService } from "@/services/bienService";
import { reservationService } from "@/services/reservationService";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";
import { Bien, Groupe } from "@/types";

export function BookingForm() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bien, setBien] = useState<Bien | null>(null);
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    groupeId: undefined as string | undefined,
    motif: "",
    nombrePersonnes: 1,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!resourceId) return;
      
      try {
        setLoading(true);
        const [bienData, groupesData] = await Promise.all([
          bienService.getById(resourceId),
          user ? groupeService.getMyGroups() : Promise.resolve([]),
        ]);
        setBien(bienData);
        setGroupes(groupesData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [resourceId, user]);

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
          <p className="text-gray-500 text-lg">{error || "Bien introuvable"}</p>
          <Link to="/catalog" className="text-blue-900 hover:underline mt-4 inline-block">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Connexion requise</h2>
        <p className="text-gray-600 mb-6">Vous devez être connecté pour effectuer une réservation.</p>
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition">
          Se connecter
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceId) return;

    setSubmitting(true);
    setError(null);

    try {
      if (!user?.id_user) {
        setError("Vous devez être connecté pour créer une réservation");
        setSubmitting(false);
        return;
      }

      await reservationService.create({
        id_bien: resourceId,
        id_user: user.id_user,
        id_groupe: formData.groupeId,
        dateDebut: formData.dateDebut + 'T00:00:00',
        dateFin: formData.dateFin + 'T23:59:59',
      });
      
      setSubmitted(true);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création de la réservation");
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Demande de réservation envoyée !</h2>
          <p className="text-gray-700 mb-6">
            Votre demande a été transmise à nos services. Vous recevrez une confirmation dans les plus brefs délais.
          </p>
          <p className="text-sm text-gray-600">Redirection vers vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-blue-900 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour au catalogue
      </Link>

      {/* Resource Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex gap-6">
          <img
            src={bien.imageUrl || "/placeholder-property.jpg"}
            alt={bien.nom}
            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{bien.nom}</h1>
            <p className="text-gray-600 mb-3">{bien.description || "Aucune description"}</p>
            <div className="flex items-center gap-4">
              {bien.capacite && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5" />
                  <span>{bien.capacite} personnes</span>
                </div>
              )}
              {bien.adresse && (
                <div className="text-sm text-gray-600">
                  📍 {bien.adresse}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <h2 className="text-2xl font-bold">Formulaire de réservation</h2>

        {/* Demandeur */}
        <div className="pb-6 border-b border-gray-100">
          <h3 className="text-base font-bold mb-3">Demandeur</h3>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user.prenom?.[0]}{user.nom?.[0]}
            </div>
            <div>
              <p className="font-semibold text-sm">{user.prenom} {user.nom}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <label className="block text-sm font-semibold mb-2">Réservation au nom de</label>
          <select
            value={formData.groupeId || ""}
            onChange={(e) => setFormData({ ...formData, groupeId: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">— Moi-même —</option>
            {groupes.map((groupe) => (
              <option key={groupe.id_groupe} value={groupe.id_groupe}>{groupe.nom}</option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="pb-6 border-b border-gray-100">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Dates de réservation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date de début *</label>
              <input
                type="date"
                required
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Date de fin *</label>
              <input
                type="date"
                required
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                min={formData.dateDebut || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="pb-6 border-b border-gray-100">
          <label className="block text-sm font-bold mb-2">Informations complémentaires</label>
          <textarea
            value={formData.motif}
            onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
            rows={4}
            placeholder="Décrivez votre événement, besoins spécifiques..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Pièces à fournir */}
        <div>
          <h3 className="text-base font-bold mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Pièces à fournir
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Joignez les documents nécessaires à votre demande (justificatifs d'association, attestations, etc.)
          </p>

          <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">Cliquez pour ajouter des fichiers</span>
            <span className="text-xs text-gray-400">PDF, JPG, PNG — plusieurs fichiers acceptés</span>
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>

          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} Ko</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
          <Link
            to="/catalog"
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
