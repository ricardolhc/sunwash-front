import { api } from '../http/api';

interface PresignedUrlResponse {
  filename: string;
  objectKey: string;
  url: string;
  expiresAt: string;
}

export async function uploadFile(file: File): Promise<string> {
  const { data } = await api.get<PresignedUrlResponse>('/storage/presigned-url', {
    params: { filename: file.name },
  });

  const uploadResponse = await fetch(data.url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error('Nao foi possivel enviar a foto para o armazenamento.');
  }

  return data.url.split('?')[0];
}
