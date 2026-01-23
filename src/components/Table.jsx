import React from "react";
import "../styles/components/Table.css";

export default function Table({ headers = [], data = [] }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: "center", padding: 16 }}>
                Nenhum registro
              </td>
            </tr>
          ) : (
            data.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => <td key={c}>{cell}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
