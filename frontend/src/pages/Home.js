import "../pages/pageCSS/Home.css";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import PopularServices from "../components/PopularServices";
import LebanesePlaces from "../components/LebanesePlaces";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />

        <PopularServices />

        <LebanesePlaces />
      </main>

      <Footer />
    </>
  );
}

export default Home;