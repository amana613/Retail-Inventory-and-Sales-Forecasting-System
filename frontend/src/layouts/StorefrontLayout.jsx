import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const StorefrontLayout = () => {
  return (
    <>
      <div className="announcement-bar">
        <p>Free delivery over $65 • Click & collect available • New arrivals every week</p>
      </div>
      <Navbar />
      <div className="quick-links-bar">
        <span>Trending:</span>
        <a href="#">Storage</a>
        <a href="#">Home Decor</a>
        <a href="#">Kitchen</a>
        <a href="#">Bedding</a>
        <a href="#">Toys</a>
      </div>
      <main className="page-content page-frame">
        <Outlet />
      </main>
    </>
  );
};

export default StorefrontLayout;
