import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { ConciergeList } from "@/components/Concierge-list";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Hero />
      </main>
    </div>
  );
}