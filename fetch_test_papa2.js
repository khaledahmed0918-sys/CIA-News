import Papa from 'papaparse';
import fetch from 'node-fetch';

const url = "https://docs.google.com/spreadsheets/d/1baiVdBjuMjMsZVhM5Eh1VC0VI_Ex4N1RPfHTnktqvSc/export?format=csv&sheet=Central%20Intelligence%20Agency";

fetch(url)
.then(res => res.text())
.then(csv => {
  const result = Papa.parse(csv, { skipEmptyLines: true });
  const rows = result.data;
  
  for (let i = 10; i < 20; i++) {
    console.log(`Row ${i}:`, rows[i]);
  }
});
