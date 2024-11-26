import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./Home";
import Product from "./Products"
import Login from "./components/login";
import Sidebar from "./components/Sidebar";
import { BrowserRouter } from 'react-router-dom'
//import DashboardComponent from './DashboardComponent'
import OurTeam from './OurTeam'
import AboutUs from './AboutUs'
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const changePage = (page) => {
    setCurrentPage(page);
  };
  return (
    <BrowserRouter>
    <>
      {isLoggedIn ? (
        <div className={`grid-container ${currentPage === 'Products' ? 'products-page' : ''}`}>
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} changePage={changePage} />
          {currentPage === 'Dashboard' && <Home />}
          {currentPage === 'Products' && <Product/>}
          {currentPage === 'AboutUs' && <AboutUs />}
          {currentPage === 'OurTeam' && <OurTeam />}
        </div>
      ) : (
        <div style={{ height: "100dvh", backgroundColor: "#051132", display: "flex", justifyContent:"center", alignItems:"center" }}>
          <Login />
        </div>
      )}
      </></BrowserRouter>
  );
}

export default App;
