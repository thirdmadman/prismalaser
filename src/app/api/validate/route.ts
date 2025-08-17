import type { NextRequest } from 'next/server';
import { validateSchema } from '@/shared/lib/validateSchema';

interface IResponse {
  isOk: boolean;
  data?: string;
  errors?: string;
}

export async function POST(request: NextRequest) {
  let result = null;
  let isOk = false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestData = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    result = await validateSchema(requestData.sourceText);

    isOk = !result.isError;
  } catch (error) {
    console.error(error);
  }

  const responseJson: IResponse = { isOk };

  if (!isOk) {
    const errorsDataString = result?.resultString;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorsData = JSON.parse(errorsDataString ?? '');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    responseJson.errors = errorsData;
  }

  if (isOk) {
    responseJson.data = result?.resultString;
  }

  return new Response(JSON.stringify(responseJson), {
    status: isOk ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
