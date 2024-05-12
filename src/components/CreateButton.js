import React from 'react';
import './CreateButton.css';

function Wrapper({ children }) {
  return (
    <div className="wrapper">
      {children}
    </div>
  );
}

function HiddenTrigger({ id }) {
  return (
    <input className="hidden-trigger" id={id} type="checkbox" />
  );
}

function CircleLabel({ forId }) {
  return (
    <label className="circle" htmlFor={forId}>
      +
    </label>
  );
}

function Subs({ handleMenuItemClick }) {
  return (
    <div className="subs">
      <button className="sub-circle" onClick={() => handleMenuItemClick('createTask')}>
        <input className="hidden-sub-trigger" id="sub1" type="radio" name="sub-circle" value="1" />
        <label htmlFor="sub1">Task</label>
      </button>
      <button className="sub-circle" onClick={() => handleMenuItemClick('createTaskGroup')}>
        <input className="hidden-sub-trigger" id="sub2" type="radio" name="sub-circle" value="2" />
        <label htmlFor="sub2">Task Group</label>
      </button>
    </div>
  );
}

function CreateButton({ handleMenuClick, handleMenuItemClick }) {
  return (
    <Wrapper>
      <HiddenTrigger id="toggle" />
      <CircleLabel forId="toggle" />
      <Subs handleMenuItemClick={handleMenuItemClick} />
    </Wrapper>
  );
}

export default CreateButton;
