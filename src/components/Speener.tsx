import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function Speener({ loading, Color }: { loading: boolean; Color: string | null }) {
  let [color, setColor] = useState(Color ?? "#ffffff");

  return (
    <div className="sweet-loading">
      <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" />

      <ClipLoader color={color} loading={loading} cssOverride={override} size={150} aria-label="Loading Spinner" data-testid="loader" />
    </div>
  );
}

export default Speener;
