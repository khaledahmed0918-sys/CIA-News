import fetch from 'node-fetch';

const url = "https://docs.google.com/spreadsheets/d/1baiVdBjuMjMsZVhM5Eh1VC0VI_Ex4N1RPfHTnktqvSc/gviz/tq?tqx=out:html&sheet=Central%20Intelligence%20Agency";

fetch(url)
.then(res => res.text())
.then(html => {
  console.log("HTML length:", html.length);
  console.log("Contains img tag?", html.includes("<img"));
});
