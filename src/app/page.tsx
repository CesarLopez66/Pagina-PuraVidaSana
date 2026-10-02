import { PageBackground } from "@/components/layout/PageBackground";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Categories } from "@/components/home/Categories";
import { Benefits } from "@/components/home/Benefits";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Reviews } from "@/components/home/Reviews";
import { Branches } from "@/components/home/Branches";
import { Philosophy } from "@/components/home/Philosophy";

export default function HomePage() {
  return (
    <>
      <PageBackground />
      <Hero />
      <TrustStrip />
      <Categories />
      <FeaturedProducts />
      <Benefits />
      <Philosophy />
      <Reviews />
      <Branches />
    </>
  );
}
