export default async function ruleExport(tableData) {
  const response = await fetch('http://127.0.0.1:8000/upload/rules/forcepoint/{rule_name}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}
