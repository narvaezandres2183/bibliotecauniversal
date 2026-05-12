import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// Global styles
import "./styles/global.css";

// Component styles
import "./styles/components/Header.css";
import "./styles/components/Navigation.css";
import "./styles/components/CatalogCard.css";
import "./styles/components/EventCard.css";
import "./styles/components/CategoryCard.css";
import "./styles/components/StatisticCard.css";
import "./styles/components/LoginForm.css";
import "./styles/components/RegistroForm.css";
import "./styles/components/ProfileForm.css";

// Layout styles
import "./styles/layout/MainLayout.css";
import "./styles/layout/AuthLayout.css";

// Section styles
import "./styles/sections/Section.css";
import "./styles/sections/CatalogSection.css";
import "./styles/sections/CategoriesSection.css";
import "./styles/sections/EventsSection.css";
import "./styles/sections/FavoritesSection.css";
import "./styles/sections/HistorySection.css";
import "./styles/sections/ReservesSection.css";
import "./styles/sections/ProfileSection.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
