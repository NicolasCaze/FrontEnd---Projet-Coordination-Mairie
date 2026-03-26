import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { LogIn, Mail, Lock, User, Shield, ClipboardList } from "lucide-react";
import { mockUsers } from "../data/mockData";

const MOCK_ACCOUNTS = [
  { userId: "u1", label: "Utilisateur", icon: User, color: "border-blue-300 hover:bg-blue-50 text-blue-900" },
  { userId: "u4", label: "Admin-Groupe", icon: ClipboardList, color: "border-purple-300 hover:bg-purple-50 text-purple-900" },
  { userId: "u6", label: "Admin-Conseil", icon: ClipboardList, color: "border-orange-300 hover:bg-orange-50 text-orange-900" },
  { userId: "u3", label: "Super-Admin", icon: Shield, color: "border-green-300 hover:bg-green-50 text-green-900" },
];

export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useOutletContext<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = {
      id: "u1",
      email: email,
      firstName: "Jean",
      lastName: "Dupont",
      role: "user",
    };
    setCurrentUser(mockUser);
    navigate("/dashboard");
  };

  const handleMockLogin = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      navigate(user.role === "super-admin" || user.role === "admin-conseil" ? "/admin" : "/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-900" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Connexion</h2>
            <p className="text-gray-600">Accédez à votre espace personnel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-blue-900 rounded" />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-blue-900 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Se connecter
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">OU</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Mock quick login */}
          <div>
            <p className="text-sm font-semibold text-gray-500 text-center mb-3">
              Connexion rapide (démo)
            </p>
            <div className="flex flex-col gap-2">
              {MOCK_ACCOUNTS.map(({ userId, label, description, icon: Icon, color }) => (
                <button
                  key={userId}
                  type="button"
                  onClick={() => handleMockLogin(userId)}
                  className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg font-semibold transition ${color}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Register */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">Pas encore de compte ?</p>
            <Link
              to="/register"
              className="inline-block w-full py-2.5 border-2 border-blue-900 text-blue-900 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
