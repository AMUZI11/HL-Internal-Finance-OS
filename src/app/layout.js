import "./globals.css";
import { TutorialProvider } from "../components/TutorialEngine";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata = {
  title: "HL Manager Pro",
  description: "Sistem Manajemen Keuangan Bisnis HL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased font-sans">
        <ErrorBoundary>
          <TutorialProvider>
            {children}
          </TutorialProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
