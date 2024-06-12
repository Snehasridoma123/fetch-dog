import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/login";
import SearchPage from "./pages/search";
import LoginRedirect from "./auth/LoginRedirect";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter,Routes,Router,Route } from "react-router-dom";
function App() {

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
