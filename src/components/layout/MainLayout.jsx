import Header from "../common/Header";
import Navigation from "../common/Navigation";
import "../../styles/layout/MainLayout.css";

function MainLayout({ children, activeSection, onSectionChange, onLogout }) {
  return (
    <div>
      <Header onLogout={onLogout} />
      <Navigation activeSection={activeSection} onSectionChange={onSectionChange} />
      {children}
    </div>
  );
}

export default MainLayout;
