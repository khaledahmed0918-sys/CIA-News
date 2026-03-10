import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const url = "https://docs.google.com/spreadsheets/d/1baiVdBjuMjMsZVhM5Eh1VC0VI_Ex4N1RPfHTnktqvSc/gviz/tq?tqx=out:html&sheet=Central%20Intelligence%20Agency";

fetch(url)
.then(res => res.text())
.then(html => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const rows = doc.querySelectorAll("table tr");
  console.log("Total rows:", rows.length);
  
  rows.forEach((row, rowIndex) => {
    if (rowIndex > 5) return; // just look at first 5
    const cells = row.querySelectorAll("td,th");
    let rowData = [];
    cells.forEach((cell, colIndex) => {
      const imgs = cell.querySelectorAll("img");
      if(imgs.length > 0){
        rowData.push(`[IMG(${imgs.length}) at ${colIndex}]`);
      } else {
        rowData.push(cell.textContent.trim());
      }
    });
    console.log(`Row ${rowIndex}:`, rowData);
  });
});

