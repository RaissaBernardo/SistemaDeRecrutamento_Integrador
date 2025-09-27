import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Table from "../components/Table";

const Dashboard = () => {
  const stats = [
    ["Vagas", 12],
    ["Candidaturas", 10],
    ["Entrevistas", 2]
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Header title="Dashboard" />
        <Table columns={["Item", "Quantidade"]} data={stats} />
      </div>
    </div>
  );
};

export default Dashboard;
