import React from "react";

function Model(props: { handleClick: React.MouseEventHandler<HTMLDivElement> | undefined }) {
  return (
    <div
      id="pop_up"
      className={
        "fixed h-full inset-4 bg-slate-900 bg-opacity-30 text-5xl backdrop-blur-sm flex justify-center items-center"
      }
      onClick={props.handleClick}
    >
      <div id="pop_up_text" className={"bg-white p-2 rounded"}>
        Model
      </div>
    </div>
  );
}

export default Model;
