// App.js
import React, { useState, useEffect } from "react";
import { clientApplication } from "./msalConfig";
import Navbar from "./components/navbar/Navbar";
import Chatbot from "./components/ChatComponent";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const requestObj = {
      scopes: ["user.read", "openid", "profile"],
    };

    try {
      const loginResponse = await clientApplication.loginPopup(requestObj);
      setUser(clientApplication.getAccount());
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const handleLogout = () => {
    clientApplication.logout();
    setUser(null);
  };

  useEffect(() => {
    const account = clientApplication.getAccount();
    if (account) {
      setUser(account);
    }
  }, []);

  return (
    <div style={{ height: "97vh" }}>
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      {user && <Chatbot user={user} />}
      <div></div>
    </div>
    
  );
};

export default App;