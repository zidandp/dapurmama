import "@/app/ui/global.css";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer"; // <-- IMPORT FOOTER

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer /> {/* <-- ADD FOOTER HERE */}
      </body>
    </html>
  );
}
