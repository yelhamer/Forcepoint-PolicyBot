export default async function uploadJson(file) {
  const formData = new FormData();

  console.log(file.text());
  formData.set('file', file);
  const response = await fetch('http://127.0.0.1:8000/upload/traffic/forcepoint/', {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: await file.text(),
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}
