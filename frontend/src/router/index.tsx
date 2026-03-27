import { createBrowserRouter } from "react-router-dom"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Mairie de Ville</h1>
        <p className="text-gray-600 mb-6">Bienvenue sur la plateforme de réservation</p>
        <div className="space-x-4">
          <a href="/login" className="text-primary hover:underline">Se connecter</a>
          <a href="/register" className="text-primary hover:underline">S'inscrire</a>
        </div>
      </div>
    </div>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])
