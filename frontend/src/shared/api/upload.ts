import request, { type Result } from './axios';

export const uploadFile = (file: File): Promise<Result<string>> => {
  const formData = new FormData();
  formData.append('file', file);

  return request.post('/api/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
