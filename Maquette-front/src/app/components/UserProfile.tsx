import { useState } from "react";
import { mockUsers, mockGroups } from "../data/mockData";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Users, 
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export function UserProfile() {
  // Simuler l'utilisateur connecté (normalement viendrait d'un contexte d'auth)
  const currentUser = mockUsers[0]; // Jean Dupont
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phone: currentUser.phone,
    email: currentUser.email
  });

  const userGroups = mockGroups.filter(group => currentUser.groupIds.includes(group.id));

  const handleSave = () => {
    // Logique de sauvegarde à implémenter
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phone: currentUser.phone,
      email: currentUser.email
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations principales */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Informations personnelles</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{currentUser.firstName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{currentUser.lastName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{currentUser.email}</span>
                  </div>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{currentUser.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statut du compte */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Statut du compte</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Type de compte</p>
                  <p className="text-gray-600">
                    {currentUser.hasAccount ? "Autonome" : "Sous tutelle"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Rôle</p>
                  <p className="text-gray-600 capitalize">
                    {currentUser.role === "super-admin"
                      ? "Super-Admin"
                      : currentUser.role === "admin-groupe"
                      ? "Admin-Groupe"
                      : "Utilisateur"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Groupes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Mes groupes</h3>
            </div>
            <div className="p-6">
              {userGroups.length > 0 ? (
                <div className="space-y-3">
                  {userGroups.map((group) => (
                    <div key={group.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-900" />
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Vous n'êtes membre d'aucun groupe pour le moment.
                </p>
              )}
            </div>
          </div>

          {/* Exonérations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Exonérations</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                {currentUser.exemptions.association ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className={currentUser.exemptions.association ? "text-green-600" : "text-gray-500"}>
                  Association
                </span>
              </div>
              <div className="flex items-center gap-3">
                {currentUser.exemptions.social ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className={currentUser.exemptions.social ? "text-green-600" : "text-gray-500"}>
                  Social
                </span>
              </div>
              <div className="flex items-center gap-3">
                {currentUser.exemptions.elected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className={currentUser.exemptions.elected ? "text-green-600" : "text-gray-500"}>
                  Élu
                </span>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Besoin d'aide ?</p>
                <p className="text-sm text-blue-700">
                  Contactez le service administratif pour modifier vos exonérations 
                  ou votre type de compte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
