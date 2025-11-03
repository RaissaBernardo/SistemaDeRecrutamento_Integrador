import React from "react";
import "../styles/Table.css";

export default function Table({ columns = [], data = [] }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: "16px" }}>Nenhum registro</td></tr>
          ) : (
            data.map((row, r) => (
              <tr key={r}>
                {columns.map((col, c) => <td key={c}>{row[col.toLowerCase()]}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
