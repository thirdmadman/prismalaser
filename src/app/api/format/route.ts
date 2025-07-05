import { formatSchema } from '@prisma/internals';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  let formattedSchemaString = null;
  let isOk = false;

  try {
    const schemaString = await request.json();

    if (!schemaString?.text) {
      throw new Error('No schema string provided');
    }

    const formatSchemaResult = await formatSchema({
      schemas: [['schema.prisma', schemaString.text]],
    });

    if (!formatSchemaResult[0] || !formatSchemaResult[0]![1]) {
      throw new Error('Unable to format schema');
    }

    formattedSchemaString = formatSchemaResult[0]![1];

    isOk = true;
  } catch (error) {
    console.error(error);
  }

  const responseJson = { isOk, data: formattedSchemaString };

  return new Response(JSON.stringify(responseJson), {
    status: isOk ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
