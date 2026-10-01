import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import VideoGrid from "@/components/VideoGrid";
import About from "@/components/About";
import BlogPreview from "@/components/BlogPreview";
import ResearchPreview from "@/components/ResearchPreview";
import Glossary from "@/components/Glossary";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <VideoGrid />
      <About />
      <BlogPreview />
      <ResearchPreview />
      <Glossary />
      <Newsletter />
      <Footer />
    </>
  );
}
