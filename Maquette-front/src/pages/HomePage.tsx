import { Link } from "react-router-dom";
import { Building2, Calendar, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  
  const features = [
    {
      icon: Building2,
      title: "Catalogue de biens",
      description: "Découvrez tous les biens municipaux disponibles à la réservation",
    },
    {
      icon: Calendar,
      title: "Réservations simplifiées",
      description: "Réservez facilement vos créneaux en quelques clics",
    },
    {
      icon: Users,
      title: "Gestion de groupes",
      description: "Créez et gérez vos groupes pour des réservations collectives",
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Vos données sont protégées et sécurisées",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Plateforme de Réservation
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Réservez facilement les biens municipaux pour vos événements et activités
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/catalog">
                Voir le catalogue
              </Link>
            </Button>
            {!isLoading && (
              user ? (
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link to="/dashboard">
                    Mon tableau de bord
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link to="/register">
                    S'inscrire
                  </Link>
                </Button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos fonctionnalités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-900" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          {!isLoading && (
            user ? (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  Bienvenue, {user.prenom} !
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Accédez à votre tableau de bord pour gérer vos réservations et groupes
                </p>
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Accéder au tableau de bord
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">
                  Prêt à commencer ?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Créez votre compte dès maintenant et accédez à tous nos services de réservation
                </p>
                <Button size="lg" asChild>
                  <Link to="/register">
                    Créer un compte gratuitement
                  </Link>
                </Button>
              </>
            )
          )}
        </div>
      </section>
    </div>
  );
}
