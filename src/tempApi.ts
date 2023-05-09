import docsParams from "./jsonData/defaultdocs.params.json";
import axios from "axios";
const dataUrl = "https://bizbi-server.onrender.com/api/flexdoc";

const fetchReportData = async (reportCod: any, parameters: any) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOnsidXNzZXJJRCI6eyJyZXF1aXJlZCI6dHJ1ZX0sIkRlZmF1bHREcml2ZXIiOnsiaXNEZWZhdWx0IjpmYWxzZX0sIkRvY3VtZW50RGVmIjp7ImlzRGVmYXVsdCI6dHJ1ZSwiRG9jdW1lbnREZWYiOjEsImlzRmlyc3QiOmZhbHNlfSwiUHJlbWlzc2lvbk10eCI6eyJkb2NMaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6NTB9LCJzdW1MaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6MjAwMDB9LCJ0YXhEb2NzIjp0cnVlLCJSZWZ1bmQiOnsiaXNBbGxvdyI6ZmFsc2V9LCJEaXNjb3VudCI6eyJpc0FsbG93Ijp0cnVlLCJpc0xpbWl0ZWQiOmZhbHNlfSwiT2JsaWdvUGFzcyI6eyJpc0FsbG93IjpmYWxzZX0sIkZsYWdlZENhc3R1bWVycyI6eyJpc0FsbG93IjpmYWxzZX19fSwidXNlcklEIjoiNjM1OGY4NzE3ZGQ5NWVjZWVlNTNlYWMzIn0sImlhdCI6MTY2Njc4MDAzNX0.BC0a3CESYo_KLbTN4w9h9ZC4IEy2OVmPV_hAlYkiDfE"
  );

  const raw = JSON.stringify({
    TID: "4",
    reportCod: reportCod,
    parameters: parameters,
  });

  const requestOptions: object = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return await fetch(dataUrl, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      console.log("res. in main !!", { res });
      return res.status.repdata;
    })
    .catch((error) => console.log("error", error));
};

export const getSellsData = async () => {
  const reportCod = docsParams.sells.datafile;
  const parameters = docsParams.sells.parameters;
  const sellsRes = await fetchReportData(reportCod, parameters);
  console.log("sells res", { sellsRes });
  return sellsRes;
};

export const getTaxesData = async () => {
  const reportCod = docsParams.taxes.datafile;
  const parameters = docsParams.taxes.parameters;
  const res = await fetchReportData(reportCod, parameters);
  console.log("taxes res", { res });
  return res;
};
export const fetchData = (url: string) => {
  return fetch(url, { mode: "no-cors" }).then((res) => res.json());
};
export const getSpacielCastumers = async () =>
  axios
    .get(
      "https://script.google.com/macros/s/AKfycbyfBt4Ueq6GAULew28xiJrl7T-dIfNDkNm1VZmAzLiD1MySjnTkP5icgtCARxNZ_wN4/exec?type=getcastumers",
      { withCredentials: false }
    )
    .then((res) => {
      console.log({ res });
      return res.data;
    })
    .catch((error) => console.log("error", error));

export const getAccountisData = async () =>
  axios
    .get(
      "https://script.google.com/macros/s/AKfycbxA__DGYQ90XUC9wDDLt6J8eRuVx-IXaexsal1wMf-VQJKguOzd3XPzo9UQuX3D_8ZE/exec?type=accountis",
      { withCredentials: false }
    )
    .then((res) => {
      console.log({ res });
      return res.data;
    })
    .catch((error) => console.log("error", error));

export const getAddedTaxData = async () =>
  axios
    .get(
      "https://script.google.com/macros/s/AKfycbxA__DGYQ90XUC9wDDLt6J8eRuVx-IXaexsal1wMf-VQJKguOzd3XPzo9UQuX3D_8ZE/exec",
      {
        withCredentials: false,
      }
    )
    .then((res) => {
      console.log({ res });
      return res.data;
    })
    .catch((error) => console.log("error", error));
