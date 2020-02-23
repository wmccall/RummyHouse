import React, { useState, useEffect } from "react";

const CopyTextButton = props => {
  const { textToCopy, children } = props;
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [textToCopy]);

  const copyText = text => {
    navigator.clipboard.writeText(text).then(
      function() {
        setClicked(true);
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  return (
    <button
      className={`Copy-Text-Button ${clicked ? "Clicked" : "Unclicked"}`}
      onClick={() => copyText(textToCopy)}
    >
      {children}
    </button>
  );
};

export default CopyTextButton;
