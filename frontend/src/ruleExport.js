import download from 'downloadjs';

export default async function ruleExport(tableData) {
  fetch('http://127.0.0.1:8000/upload/rules/forcepoint/policygenrules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tableData),
  })
    .then((response) => response.blob())
    .then((blob) => download(blob, 'rules.xml'))
    .catch((err) => alert(err));
}
