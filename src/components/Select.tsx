import React, { useState } from "react";
import { chartsPivot } from "../typing.d";
function Select(props: any) {
  return (
    <>
      {props?.isTax ? (
        <select name="select2" className={"bg-green-800 text-center text-white align-middle "} id="type" onChange={props.handleSelect}>
          <option value={undefined} selected hidden>
            בחר סוג מידע
          </option>
          {props.pivot.map((key: string) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      ) : (
        <select name="select" className={"bg-green-800 text-center text-white align-middle "} id="pivot" onChange={props.handleSelect}>
          <option value={undefined} selected hidden>
            מפתח מיון
          </option>
          {Object.keys(chartsPivot).map((pivot, idx) => (
            <option key={idx}>{pivot}</option>
          ))}
        </select>
      )}
    </>
  );
}

export default Select;
