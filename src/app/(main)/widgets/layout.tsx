import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Navbar from "@/app/components/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <Header />
      <main className="m-auto lg:max-w-[1536px] border-l border-r flex flex-grow w-full items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Navbar />
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          {children}
        </main>
      </main>
      <Footer />
    </div>
  );
}
