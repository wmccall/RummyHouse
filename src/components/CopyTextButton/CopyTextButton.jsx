import React, { useState, useEffect } from 'react';
import * as UTIL from '../../constants/util';

const CopyTextButton = props => {
  const { textToCopy, children } = props;
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [textToCopy]);

  UTIL.useInterval(
    () => {
      setClicked(false);
    },
    clicked ? 1000 : null,
  );

  const copyText = text => {
    navigator.clipboard.writeText(text).then(
      () => {
        setClicked(true);
      },
      err => {
        console.error('Async: Could not copy text: ', err);
      },
    );
  };

  return (
    <div className="Copy-Text">
      <div className={`Copy-Message ${clicked ? 'visible' : 'hidden'}`}>
        Link copied to clipboard!
      </div>
      <button
        className="Copy-Text-Button"
        onClick={() => copyText(textToCopy)}
        type="button"
      >
        {children}
      </button>
    </div>
  );
};

export default CopyTextButton;
