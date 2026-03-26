import { Outlet, Link, useLocation } from "react-router";
import { Building2, Calendar, Users, LogIn, LogOut, LayoutDashboard, Home as HomeIcon } from "lucide-react";
import { useState } from "react";

export function Root() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Simulate user session (in real app, this would come from auth context)
  const isAdmin = currentUser?.role === "super-admin" || currentUser?.role === "admin-conseil";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <Building2 className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Mairie de Ville</h1>
                <p className="text-sm text-blue-200">Système de réservation</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 hover:text-blue-200 transition ${
                  location.pathname === "/" ? "text-blue-300" : ""
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                Accueil
              </Link>
              <Link
                to="/catalog"
                className={`flex items-center gap-2 hover:text-blue-200 transition ${
                  location.pathname === "/catalog" ? "text-blue-300" : ""
                }`}
              >
                <Calendar className="w-4 h-4" />
                Catalogue
              </Link>
              
              {currentUser ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-2 hover:text-blue-200 transition ${
                        location.pathname.startsWith("/admin") ? "text-blue-300" : ""
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Administration
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 hover:text-blue-200 transition ${
                        location.pathname === "/dashboard" ? "text-blue-300" : ""
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Mon espace
                    </Link>
                  )}
                  <Link
                    to="/logout"
                    className="flex items-center gap-2 hover:text-blue-200 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center gap-2 hover:text-blue-200 transition ${
                    location.pathname === "/login" ? "text-blue-300" : ""
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet context={{ currentUser, setCurrentUser }} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <p className="text-sm text-gray-300">Mairie de Ville</p>
              <p className="text-sm text-gray-300">1 Place de la République</p>
              <p className="text-sm text-gray-300">75000 Paris</p>
              <p className="text-sm text-gray-300 mt-2">Tél: 01 23 45 67 89</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Horaires</h3>
              <p className="text-sm text-gray-300">Lundi - Vendredi</p>
              <p className="text-sm text-gray-300">9h00 - 12h00 / 14h00 - 17h00</p>
              <p className="text-sm text-gray-300 mt-2">Samedi</p>
              <p className="text-sm text-gray-300">9h00 - 12h00</p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Informations</h3>
              <p className="text-sm text-gray-300">
                Système de réservation en ligne pour les salles et matériels municipaux
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            © 2026 Mairie de Ville. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
