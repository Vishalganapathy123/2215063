import React, { createContext, useState, useEffect } from "react";

export const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
  const [urls, setUrls] = useState([]);
  const [shortUrl, setShortUrl] = useState("");

  // Fetch all stats from backend
  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats");
      const data = await res.json();
      setUrls(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const shortenUrl = async (originalUrl) => {
    if (!originalUrl) return;

    try {
      const res = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });
      const data = await res.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        fetchStats(); // update stats
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UrlContext.Provider value={{ urls, shortUrl, shortenUrl }}>
      {children}
    </UrlContext.Provider>
  );
};
