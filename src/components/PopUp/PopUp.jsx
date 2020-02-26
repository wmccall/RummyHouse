import React from 'react';

const PopUp = props => {
  const { message, isVisible, setGameLink, setVisible, children } = props;

  const handleClick = () => {
    setVisible(false);
    setGameLink('');
  };

  return (
    <div
      className={`PopUp-Overlay ${isVisible ? 'visible' : ''}`}
      onClick={() => handleClick()}
    >
      <div className="PopUp" onClick={e => e.stopPropagation()}>
        <div className="Top-Bar">
          <div className="Message">{message}</div>
          <button onClick={() => handleClick()} type="button">
            X
          </button>
        </div>
        <div className="Content">{children}</div>
      </div>
    </div>
  );
};

export default PopUp;
