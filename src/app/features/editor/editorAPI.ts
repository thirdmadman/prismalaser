export const validateSchema = async (sourceText: string) => {
  const response = await fetch('api/validate', { method: 'POST', body: JSON.stringify({ sourceText }) });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseData: { isOk: boolean; data: string } = await response.json();

  return responseData;
};

export const formatSchema = async (sourceText: string) => {
  const response = await fetch('api/format', { method: 'POST', body: JSON.stringify({ sourceText }) });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseData: { isOk: boolean; data: string } = await response.json();

  return responseData;
};
