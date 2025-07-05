import { validateSchema } from '@/shared/lib/validateSchema';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  let result = null;
  let isOk = false;

  try {
    const requestData = await request.json();

    result = await validateSchema(requestData.text);

    isOk = !result?.isError;
  } catch (error) {
    console.error(error);
  }

  const responseJson = { isOk, data: result?.resultString };

  return new Response(JSON.stringify(responseJson), {
    status: isOk ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
