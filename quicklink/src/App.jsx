import React from "react";
import { UrlProvider } from "./context/urlcontext";
import Home from "./pages/Home";

function App() {
  return (
    <UrlProvider>
      <Home />
    </UrlProvider>
  );
}

export default App;
