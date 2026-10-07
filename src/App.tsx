import YoojinHero from "./components/YoojinHero/YoojinHero";
import PortfolioChapters from "./components/PortfolioChapters/PortfolioChapters";
// Load mobile presentation after every component's shared styles.
import "./components/YoojinHero/YoojinHero.mobile.css";
import "./components/YoojinHero/heroControls.mobile.css";
import "./components/PortfolioChapters/PortfolioChapters.mobile.css";
import "./components/SelectedWorkMagazine/mobile.css";
import "./mobile.polish.css";

function App() {
  return (
    <>
      <YoojinHero />
      <PortfolioChapters />
    </>
  );
}

export default App;
