import { Link } from "react-router";
import { Calendar, Building, Wrench, Users, Shield, FileCheck, ArrowRight } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1672950082224-9a5461f054ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjB0b3duJTIwaGFsbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDIxODIxNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Mairie"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">
              Réservez vos salles et matériels municipaux en ligne
            </h1>
            <p className="text-base text-blue-100 mb-6">
              Un système simple et transparent pour réserver les ressources de votre mairie.
              Réservation possible avec ou sans compte utilisateur.
            </p>
            <div className="flex gap-4">
              <Link
                to="/catalog"
                className="bg-white text-blue-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2 text-sm"
              >
                Voir le catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-center mb-8">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-11 h-11 rounded-full flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-blue-900" />
            </div>
            <h3 className="text-base font-bold mb-2">1. Consultez le catalogue</h3>
            <p className="text-gray-600 text-sm">
              Parcourez nos salles et matériels disponibles avec leurs caractéristiques et disponibilités.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-11 h-11 rounded-full flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5 text-blue-900" />
            </div>
            <h3 className="text-base font-bold mb-2">2. Réservez en ligne</h3>
            <p className="text-gray-600 text-sm">
              Faites votre demande de réservation directement en ligne, avec ou sans compte utilisateur.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-11 h-11 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-blue-900" />
            </div>
            <h3 className="text-base font-bold mb-2">3. Validation</h3>
            <p className="text-gray-600 text-sm">
              Votre demande est examinée par nos services qui vous confirment la réservation.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-center mb-8">Nos ressources disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <Building className="w-8 h-8 text-blue-900 mb-3" />
              <h3 className="text-base font-bold mb-2">Salles municipales</h3>
              <p className="text-gray-600 text-sm mb-3">
                Salle des fêtes, salles de réunion, salles polyvalentes adaptées à tous vos événements.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>Équipements modernes inclus</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>Tarifs adaptés selon le profil</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm">
              <Wrench className="w-8 h-8 text-blue-900 mb-3" />
              <h3 className="text-base font-bold mb-2">Matériel municipal</h3>
              <p className="text-gray-600 text-sm mb-3">
                Tables, chaises, systèmes de sonorisation et autres équipements pour vos manifestations.
              </p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>Matériel professionnel et entretenu</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>Location par lots</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold mb-3">Prêt à réserver ?</h2>
          <p className="text-sm text-blue-100 mb-5">
            Consultez notre catalogue et faites votre demande en quelques clics
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition text-sm"
          >
            Accéder au catalogue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
