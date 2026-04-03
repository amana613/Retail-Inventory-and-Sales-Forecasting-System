import { Outlet } from "react-router-dom";

const RiderLayout = () => {
  return (
    <div
      className="rider-layout"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-light)" }}
    >
      <header
        className="store-header"
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, color: "var(--primary-red)" }}>Rider Portal</h2>
        <button className="btn btn-outline">Logout</button>
      </header>
      <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RiderLayout;
