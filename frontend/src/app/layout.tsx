import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "CatchCat • Monad",
  description: "Kameranı aç, kediyi veya köpeği tespit et. Yakala ve NFT olarak sahiplen. Monad üzerinde.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white min-h-screen flex flex-col relative font-sans">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black -z-50 pointer-events-none" />
        <Providers>
          <Navbar />
          <main className="pt-20 flex-grow z-10">
            {children}
          </main>
          
          <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md py-8 mt-12 z-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                  🐾
                </div>
                <span className="font-bold text-gray-300">CatchCat</span>
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} CatchCat • Monad. Gerçek kamera + AI ile yakala, NFT olarak sahip ol.
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-emerald-400 transition-colors">Nasıl Oynanır</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Monad</a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
