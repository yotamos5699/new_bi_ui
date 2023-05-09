import React from "react";
import Select from "./Select";
import { PivotData } from "../typing";
import { HandleCheackedType } from "../App";

function Nav({
  handleClick,
  setPivot,
  handleSelect,
  pivot,
  checked,
  setChecked,
  handleChecked,
  setSelectedGraph,
  setCurrentKey,
  selectedGraph,
  dataType,
}: {
  handleClick: (e: any) => Promise<void>;
  setPivot: React.Dispatch<React.SetStateAction<PivotData>>;
  handleSelect: (e: any) => Promise<void>;
  pivot: PivotData;
  checked: {
    pro: boolean;
    regular: boolean;
    all: boolean;
  };
  setChecked: React.Dispatch<
    React.SetStateAction<{
      pro: boolean;
      regular: boolean;
      all: boolean;
    }>
  >;
  handleChecked: HandleCheackedType;
  setSelectedGraph: React.Dispatch<
    React.SetStateAction<{
      bar: boolean;
      pie: boolean;
    }>
  >;
  setCurrentKey: React.Dispatch<React.SetStateAction<string | null>>;
  selectedGraph: {
    bar: boolean;
    pie: boolean;
  };
  dataType: string;
}) {
  return (
    <div className="">
      <div className="flex flex-row-reverse gap-4 justify-center">
        {dataType != "מע'מ" && dataType != "רוא'ח" && (
          <Select
            handleSelect={handleSelect}
            setPivot={setPivot}
            pivot={pivot}
          />
        )}

        <div className="flex flex-col">
          <label className="flex text-white justify-center mb-1">
            תאריך התחלה
          </label>
          <input name="start" type="date" onChange={handleSelect} />
        </div>
        <div className="flex flex-col">
          <label className="flex text-white justify-center mb-1">
            תאריך סיום
          </label>
          <input name="end" type="date" onChange={handleSelect} />
        </div>
        <div className="flex flex-col">
          <Select
            handleSelect={handleSelect}
            pivot={["סטטיסטיקה", "מע'מ", "רוא'ח"]}
            isTax={true}
          />

          <button
            name="submit"
            className="bg-gray-600 h-full justify-center mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClick}
          >
            הפק
          </button>
        </div>
      </div>
      {dataType != "מע'מ" && dataType != "רוא'ח" && (
        <div className="flex flex-row-reverse justify-center gap-4">
          <div className="flex flex-col border-2 border-gray-400 px-2">
            <label className="text-white">שקיבלו הזמנות</label>
            <input
              checked={checked.all}
              name="all"
              type="checkbox"
              onChange={(e) =>
                handleChecked(e.target.name, setChecked, checked, setCurrentKey)
              }
            />
          </div>
          <div className="flex flex-col border-2 border-gray-400 px-2">
            <label className="text-white">סיטונאים</label>
            <input
              checked={checked.pro}
              name="pro"
              type="checkbox"
              onChange={(e) =>
                handleChecked(e.target.name, setChecked, checked, setCurrentKey)
              }
            />
          </div>
          <div className="flex flex-col border-2 border-gray-400 px-2">
            <label className="text-white">כלליים</label>
            <input
              checked={checked.regular}
              name="regular"
              type="checkbox"
              onChange={(e) =>
                handleChecked(e.target.name, setChecked, checked, setCurrentKey)
              }
            />
          </div>
          <div className=" flex flex-col justify-center gap-2">
            <p className="text-white w-full text-center">בחר גרף</p>
            <div className="flex gap-2">
              <div className="flex flex-col border-2 border-gray-400 px-2">
                <label className="text-white">גרף בר</label>
                <input
                  checked={selectedGraph.bar}
                  name="bar"
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedGraph((prev: any) => ({
                      ...prev,
                      [e.target.name]:
                        !prev[e.target.name as keyof typeof prev],
                    }))
                  }
                />
              </div>
              <div className="flex flex-col border-2 border-gray-400 px-2">
                <label className="text-white">גרף עוגה</label>
                <input
                  checked={selectedGraph.pie}
                  name="pie"
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedGraph((prev: any) => ({
                      ...prev,
                      [e.target.name]:
                        !prev[e.target.name as keyof typeof prev],
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
