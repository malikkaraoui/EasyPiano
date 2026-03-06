import "@/index.css";
import AuthProvider from "@context/AuthProvider";
import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import ConfigBanner from "@components/UI/ConfigBanner";

export const metadata = {
  metadataBase: new URL("https://easypiano.ch"),
  title: {
    default: "EasyPiano - Accordeur de Piano en Suisse",
    template: "%s | EasyPiano",
  },
  description:
    "Trouvez et réservez un accordeur de piano qualifié en Suisse. Prix fixe, booking instantané, pros validés.",
  openGraph: {
    title: "EasyPiano - Accordeur de Piano",
    description:
      "Réservation en ligne d'accordeurs de piano qualifiés en Suisse",
    url: "https://easypiano.ch",
    siteName: "EasyPiano",
    locale: "fr_CH",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <div className="app-layout">
            <Header />
            <main className="main-content">
              <ConfigBanner />
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
