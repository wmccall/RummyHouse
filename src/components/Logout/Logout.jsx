import React, { useContext } from "react";
import { FirebaseContext } from "../../context";

const Logout = () => {
  const firebaseContext = useContext(FirebaseContext);
  const { signOut } = firebaseContext;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="LogoutLogout">
      <button onClick={() => handleSignOut()}>Log out</button>
    </div>
  );
};

export default Logout;
