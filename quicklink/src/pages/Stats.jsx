import { useEffect, useState } from "react";

function Stats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Link Statistics</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.id}>
              <td>{s.originalUrl}</td>
              <td><a href={s.shortUrl} target="_blank">{s.shortUrl}</a></td>
              <td>{s.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;
