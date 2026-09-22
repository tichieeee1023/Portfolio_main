import YoojinHero from "./components/YoojinHero/YoojinHero";
import "./App.css";

function App() {
  return (
    <>
      <YoojinHero />

      <main>
        <section id="about" className="portfolioSection">
          <span className="sectionNumber">01</span>
          <h2>ABOUT</h2>
        </section>

        <section id="projects" className="portfolioSection">
          <span className="sectionNumber">02</span>
          <h2>PROJECTS</h2>
        </section>

        <section id="contact" className="portfolioSection">
          <span className="sectionNumber">03</span>
          <h2>CONTACT</h2>
        </section>
      </main>
    </>
  );
}

export default App;