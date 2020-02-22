import React from "react";

const PopUp = props => {
  const { message, isVisible, setVisible, children } = props;
  return (
    <div
      className={`PopUp-Overlay ${isVisible ? "visible" : ""}`}
      onClick={() => setVisible(false)}
    >
      <div className="PopUp" onClick={e => e.stopPropagation()}>
        <div className="Message">{message}</div>
        <div className="Content">{children}</div>
      </div>
    </div>
  );
};

export default PopUp;
