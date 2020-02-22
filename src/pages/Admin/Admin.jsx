import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin";
  });
  return <div>Admin</div>;
};

export default compose(withRouter)(Admin);
