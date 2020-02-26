import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const Account = () => {
  useEffect(() => {
    document.title = 'Account';
  });
  return <div>Account</div>;
};

export default compose(withRouter)(Account);
