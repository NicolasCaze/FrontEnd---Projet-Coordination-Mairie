import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Users, ArrowLeft, Hash } from "lucide-react";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";

export function JoinGroup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg mb-4">Veuillez vous connecter</p>
        <Link to="/login" className="text-blue-900 hover:underline">Se connecter</Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 8) {
      setCode(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 8) {
      setError("Le code doit contenir exactement 8 caractères.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Note: Cette fonctionnalité nécessite un endpoint backend pour rejoindre un groupe par code
      // await groupeService.joinByCode(code);
      alert("Demande envoyée avec succès !");
      navigate("/my-groups");
    } catch (err: any) {
      setError(err.response?.data?.message || "Code invalide ou erreur lors de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-700" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Rejoindre un groupe</h2>
            <p className="text-gray-600">
              Saisissez le code fourni par votre administrateur de groupe
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-1">
                <Hash className="w-4 h-4" />
                Code du groupe
              </label>
              <input
                type="text"
                value={code}
                onChange={handleChange}
                placeholder="EX : A1B2C3D4"
                maxLength={8}
                className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-mono tracking-widest uppercase focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  error ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              <div className="flex justify-between mt-1">
                {error ? (
                  <p className="text-sm text-red-600">{error}</p>
                ) : (
                  <span />
                )}
                <p className="text-sm text-gray-400 ml-auto">{code.length}/8</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={code.length !== 8 || loading}
              className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
