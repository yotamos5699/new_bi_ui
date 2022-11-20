import docsParams from "./defaultdocs.params.json";
//import axios, { AxiosResponse } from "axios";

export async function getReportData() {
  const body: string = JSON.stringify({});
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOnsidXNzZXJJRCI6eyJyZXF1aXJlZCI6dHJ1ZX0sIkRlZmF1bHREcml2ZXIiOnsiaXNEZWZhdWx0IjpmYWxzZX0sIkRvY3VtZW50RGVmIjp7ImlzRGVmYXVsdCI6dHJ1ZSwiRG9jdW1lbnREZWYiOjEsImlzRmlyc3QiOmZhbHNlfSwiUHJlbWlzc2lvbk10eCI6eyJkb2NMaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6NTB9LCJzdW1MaW1pdCI6eyJpc0xpbWl0ZWQiOnRydWUsIkFtb3VudCI6MjAwMDB9LCJ0YXhEb2NzIjp0cnVlLCJSZWZ1bmQiOnsiaXNBbGxvdyI6ZmFsc2V9LCJEaXNjb3VudCI6eyJpc0FsbG93Ijp0cnVlLCJpc0xpbWl0ZWQiOmZhbHNlfSwiT2JsaWdvUGFzcyI6eyJpc0FsbG93IjpmYWxzZX0sIkZsYWdlZENhc3R1bWVycyI6eyJpc0FsbG93IjpmYWxzZX19fSwidXNlcklEIjoiNjM1OGY4NzE3ZGQ5NWVjZWVlNTNlYWMzIn0sImlhdCI6MTY2Njc4MDAzNX0.BC0a3CESYo_KLbTN4w9h9ZC4IEy2OVmPV_hAlYkiDfE"
  );

  const raw = JSON.stringify({
    TID: "4",
    reportCod: docsParams.datafile,
    parameters: docsParams.parameters,
  });

  const requestOptions: object = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return await fetch("http://localhost:3000/api/flexdoc", requestOptions)
    .then((response) => response.json())

    .catch((error) => console.log("error", error));
  //doGet(res);
}

export const fetchData = (url: string) => {
  return  fetch(url, { mode: "no-cors" }).then((res) => res.json());
};


