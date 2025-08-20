import { useContext } from "react";
import { UrlContext } from "../context/UrlContext";

function Gotolink() {
  const { urls } = useContext(UrlContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Shortened Links</h2>
      <ul>
        {urls.map((u, i) => (
          <li key={i}>
            {u.originalUrl} → <a href={u.shortUrl} target="_blank">{u.shortUrl}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Gotolink;
