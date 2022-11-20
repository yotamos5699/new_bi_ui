import React, { useState } from "react";
import { chartsPivot } from "../typing.d";
function Select(props: any) {
  return (
    <select name="select" className={"bg-orange-100 align-middle text-5xl"} id="pivot" onChange={props.handleSelect}>
      <option value={undefined} selected hidden>
        מפתח מיון
      </option>
      {Object.keys(chartsPivot).map((pivot, idx) => (
        <option key={idx}>{pivot}</option>
      ))}
    </select>
  );
}

export default Select;
