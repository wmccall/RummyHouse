import React, { useEffect } from "react";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin";
  });
  return <div>Admin</div>;
};

export default Admin;
