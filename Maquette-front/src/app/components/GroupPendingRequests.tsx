import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, ShieldCheck, Loader2 } from "lucide-react";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";
import { Groupe } from "@/types";

export function GroupPendingRequests() {
  const { user } = useAuth();
  const [groupes, setGroupes] = useState<Groupe[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Veuillez vous connecter</p>
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

  const handleValidate = async (groupeId: number, membreId: number) => {
    try {
      await groupeService.acceptMember(groupeId, membreId);
      const data = await groupeService.getMyGroups();
      setGroupes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (groupeId: number, membreId: number) => {
    try {
      await groupeService.rejectMember(groupeId, membreId);
      const data = await groupeService.getMyGroups();
      setGroupes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPending = 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Demandes d'adhésion en attente</h1>
            <p className="text-gray-600 text-sm">Validez ou refusez les demandes pour vos groupes</p>
          </div>
          {totalPending > 0 && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              {totalPending} en attente
            </span>
          )}
        </div>
      </div>

      {groupes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Vous n'administrez aucun groupe</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupes.map((groupe) => (
            <div key={groupe.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* En-tête groupe */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span className="font-bold text-sm">{groupe.nom}</span>
                  <span className="text-xs text-gray-500">{groupe.description || ""}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    À jour
                  </span>
                  <Link
                    to={`/groups/${groupe.id}/manage`}
                    className="text-xs text-blue-700 hover:underline"
                  >
                    Gérer le groupe →
                  </Link>
                </div>
              </div>

              <p className="text-sm text-gray-400 text-center py-4">Aucune demande en attente pour ce groupe</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
