import React, { useState, useContext } from "react";
import { UrlContext } from "../context/urlcontext";

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const { shortUrl, shortenUrl, urls } = useContext(UrlContext);

  const handleShorten = async () => {
    if (!originalUrl) return alert("Enter a URL");
    await shortenUrl(originalUrl);
    setOriginalUrl("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
      <h2>URL Shortener</h2>
      <input
        type="text"
        placeholder="Enter URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        style={{ width: "70%", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleShorten} style={{ padding: "10px 20px" }}>Shorten</button>

      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </div>
      )}

      <h3 style={{ marginTop: "30px" }}>All URLs</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Original URL</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Short URL</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u) => (
            <tr key={u.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.id}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.originalUrl}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <a href={u.shortUrl} target="_blank" rel="noreferrer">{u.shortUrl}</a>
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
