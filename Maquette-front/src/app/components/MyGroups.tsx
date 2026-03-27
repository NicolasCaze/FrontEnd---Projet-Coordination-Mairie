import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, Hash, ArrowLeft, UserPlus, CheckCircle, Clock, X, LogOut, ShieldCheck, Settings, Loader2 } from "lucide-react";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";
import { Groupe } from "@/types";


export function MyGroups() {
  const { user } = useAuth();
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const data = await groupeService.getMyGroups();
        setGroupes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchGroupes();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-500 mb-4">Veuillez vous connecter</p>
        <Link to="/login" className="text-blue-900 hover:underline">Se connecter</Link>
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

  const isManagerRole = user.role === "ADMIN";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 8) { setCode(value); setError(""); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 8) { setError("Le code doit contenir exactement 8 caractères."); return; }
    
    try {
      // Logique pour rejoindre un groupe avec un code
      // await groupeService.joinGroup(groupeId);
      setSubmitted(true);
      setCode("");
    } catch (err) {
      setError("Erreur lors de la tentative de rejoindre le groupe");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCode("");
    setError("");
    setSubmitted(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Voulez-vous vraiment quitter ce groupe ?")) return;
    
    try {
      await groupeService.leaveGroup(id);
      setGroupes(groupes.filter(g => g.id_groupe !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sortie du groupe");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mes groupes</h1>
          {!isManagerRole && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition"
            >
              <UserPlus className="w-4 h-4" />
              Rejoindre un groupe
            </button>
          )}
        </div>
      </div>

      {/* Liste des groupes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-900" />
          Liste des groupes
        </h2>

        {groupes.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {groupes.map((groupe) => (
              <div key={groupe.id_groupe} className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                  <Users className="w-4 h-4 text-blue-900" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{groupe.nom}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {groupe.description || "Aucune description"}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" /> Membre
                </span>

                <Link
                  to={`/groups/${groupe.id_groupe}/manage`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 transition"
                >
                  <Users className="w-3 h-3" />
                  Voir
                </Link>
                <button
                  onClick={() => handleRemove(groupe.id_groupe)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <LogOut className="w-3 h-3" /> Quitter
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            Vous n'avez rejoint aucun groupe pour l'instant.
          </p>
        )}
      </div>

      {/* Modal rejoindre un groupe */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-700" />
                Rejoindre un groupe
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Saisissez le code de 8 caractères fourni par votre administrateur de groupe.
            </p>
            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm mb-4">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Demande envoyée, en attente de validation.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="relative mb-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={code}
                    onChange={handleChange}
                    placeholder="EX : A1B2C3D4"
                    maxLength={8}
                    autoFocus
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm font-mono tracking-widest uppercase focus:ring-2 focus:ring-purple-500 focus:border-transparent ${error ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  />
                </div>
                <div className="flex justify-between mb-4">
                  {error ? <p className="text-xs text-red-600">{error}</p> : <span />}
                  <p className="text-xs text-gray-400 ml-auto">{code.length}/8</p>
                </div>
                <button
                  type="submit"
                  disabled={code.length !== 8}
                  className="w-full py-2.5 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Envoyer la demande
                </button>
              </form>
            )}
            <button onClick={handleCloseModal} className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
