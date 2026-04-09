import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, UserMinus, ShieldCheck, UserPlus, Search, X, Trash2, Hash, Pencil, Save, Loader2 } from "lucide-react";
import { groupeService } from "@/services/groupeService";
import { useAuth } from "@/contexts/AuthContext";
import { Groupe, GroupeMembre } from "@/types";

export function GroupManagement() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const [groupe, setGroupe] = useState<Groupe | null>(null);
  const [membres, setMembres] = useState<GroupeMembre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: "",
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) return;
      
      try {
        const [groupeData, membresResponse] = await Promise.all([
          groupeService.getById(groupId),
          groupeService.getMembers(groupId)
        ]);
        console.log("DEBUG Frontend - Groupe:", groupeData);
        console.log("DEBUG Frontend - Réponse membres:", membresResponse);
        
        // Extraire le tableau content de l'objet paginé
        const membresData = membresResponse.content || [];
        console.log("DEBUG Frontend - Membres extraits:", membresData);
        console.log("DEBUG Frontend - Premier membre:", membresData[0]);
        
        setGroupe(groupeData);
        setMembres(membresData);
        setEditForm({
          nom: groupeData.nom,
          description: groupeData.description || ""
        });
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [groupId]);

  // Vérifier si l'utilisateur connecté est l'admin de CE groupe
  const isGroupAdmin = membres.some(m => m.id_user === user?.id_user && m.roleGroupe === "ADMIN");
  const backTo = "/my-groups";
  const backLabel = "Retour à mes groupes";

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

  if (!groupe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Groupe introuvable.</p>
        <Link to={backTo} className="text-blue-900 hover:underline">Retour</Link>
      </div>
    );
  }

  const handleRemoveMember = async (membreId: number) => {
    if (!confirm("Voulez-vous vraiment retirer ce membre ?")) return;
    
    try {
      await groupeService.removeMember(groupId!, membreId);
      setMembres(membres.filter(m => m.id !== membreId));
    } catch (err) {
      console.error(err);
      alert("Erreur lors du retrait du membre");
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    
    try {
      await groupeService.addMember(groupId!, selectedUserId);
      const membresData = await groupeService.getMembers(groupId!);
      setMembres(membresData);
      setShowAddModal(false);
      setSearch("");
      setSelectedUserId(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du membre");
    }
  };

  const searchResults: any[] = [];

  const handleAccept = async (membreId: number) => {
    try {
      await groupeService.acceptMember(groupId!, membreId);
      const membresData = await groupeService.getMembers(groupId!);
      setMembres(membresData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (membreId: number) => {
    try {
      await groupeService.rejectMember(groupId!, membreId);
      const membresData = await groupeService.getMembers(groupId!);
      setMembres(membresData);
    } catch (err) {
      console.error(err);
    }
  };

  const canRemove = (membre: GroupeMembre) => {
    if (!isGroupAdmin) return false;
    if (membre.id_user === user?.id_user) return false;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{groupe.nom}</h1>
            <p className="text-sm text-gray-500 mt-1">{groupe.description}</p>
          </div>
        </div>
      </div>

      {/* Membres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-900" />
          Membres
          <span className="text-xs font-normal text-gray-400">{membres.length} membre{membres.length > 1 ? "s" : ""}</span>
        </h2>

        {membres.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {membres.map((member: GroupeMembre) => (
              <div key={member.id_user} className="flex items-center gap-3 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  member.roleGroupe === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {member.roleGroupe === "ADMIN"
                    ? <ShieldCheck className="w-4 h-4" />
                    : `${member.prenom[0]}${member.nom[0] ?? ""}`
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{member.prenom} {member.nom}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                {member.roleGroupe === "ADMIN" && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    Administrateur
                  </span>
                )}
                {isGroupAdmin && (
                  <button
                    onClick={() => handleRemoveMember(member.id_user)}
                    disabled={!canRemove(member)}
                    title={!canRemove(member) ? "Impossible de retirer un administrateur" : "Retirer du groupe"}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      canRemove(member)
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <UserMinus className="w-3 h-3" />
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Aucun membre dans ce groupe.</p>
        )}
      </div>

      {/* Demandes en attente - fonctionnalité désactivée pour l'instant */}
      {/* {isGroupAdmin && <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-bold flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-orange-600" />
          Demandes en attente
        </h2>
        <p className="text-sm text-gray-500 text-center py-4">Aucune demande en attente.</p>
      </div>} */}


      {deleted && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium text-center">
          Le groupe a été supprimé. <Link to={backTo} className="underline">Retour</Link>
        </div>
      )}

      {/* Modal suppression groupe */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => { setShowDeleteModal(false); setDeleteConfirmName(""); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-bold">Supprimer le groupe</h2>
                <p className="text-xs text-gray-500">Cette action est irréversible</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Pour confirmer, saisissez le nom du groupe : <strong>{groupe.nom}</strong>
            </p>
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={groupe.nom}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                disabled={deleteConfirmName !== groupe.nom}
                onClick={() => { setDeleted(true); setShowDeleteModal(false); setDeleteConfirmName(""); }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Supprimer définitivement
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmName(""); }}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier le groupe */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold">Modifier le groupe</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nom *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                disabled={!editForm.nom.trim()}
                onClick={() => { setGroupe({ ...groupe, ...editForm }); setShowEditModal(false); }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />Enregistrer
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter un membre */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => { setShowAddModal(false); setSearch(""); setSelectedUserId(null); setAsAdmin(false); }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-900" />
                Ajouter un membre
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setSearch(""); setSelectedUserId(null); setAsAdmin(false); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recherche */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedUserId(null); }}
                placeholder="Rechercher par nom..."
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Résultats */}
            {search.trim().length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 max-h-48 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                        selectedUserId === user.id
                          ? "bg-blue-50 border-l-2 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                        {user.firstName[0]}{user.lastName?.[0] ?? ""}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                        {user.email && <p className="text-xs text-gray-400">{user.email}</p>}
                      </div>
                      {selectedUserId === user.id && (
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Aucun utilisateur trouvé</p>
                )}
              </div>
            )}

            {/* Statut admin */}
            {selectedUserId && (
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={asAdmin}
                    onChange={(e) => setAsAdmin(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">Administrateur du groupe</p>
                  <p className="text-xs text-gray-500">L'utilisateur pourra gérer les membres et les demandes</p>
                </div>
                {asAdmin && <ShieldCheck className="w-4 h-4 text-purple-700 ml-auto flex-shrink-0" />}
              </label>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddMember}
                disabled={!selectedUserId}
                className="flex-1 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
              <button
                onClick={() => { setShowAddModal(false); setSearch(""); setSelectedUserId(null); setAsAdmin(false); }}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
