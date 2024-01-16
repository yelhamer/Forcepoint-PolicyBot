export default async function uploadJson(file) {
  const formData = new FormData();
  formData.set('file', file);
  const response = await fetch('http://localhost:8000/uploadJson', {
    method: 'post',
    body: formData,
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}
