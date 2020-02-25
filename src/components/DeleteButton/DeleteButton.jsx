import React, { useState } from "react";
import closedCan from "../../resources/svg/closedCan.svg";
import openCan from "../../resources/svg/openCan.svg";

const DeleteButton = props => {
  const { onClick } = props;
  const [hover, setHover] = useState(false);

  return (
    <button
      className={`Delete-Button ${hover ? "Hover" : ""}`}
      onClick={e => {
        onClick();
        e.stopPropagation();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>
        <img src={hover ? openCan : closedCan} alt="delete" />
      </div>
    </button>
  );
};

export default DeleteButton;
