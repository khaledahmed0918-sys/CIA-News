import fetch from 'node-fetch';

const url = "https://docs.google.com/spreadsheets/d/1baiVdBjuMjMsZVhM5Eh1VC0VI_Ex4N1RPfHTnktqvSc/gviz/tq?tqx=out:json&sheet=Central%20Intelligence%20Agency";

fetch(url)
.then(res => res.text())
.then(text => {
  console.log(text.substring(0, 2000));
});
