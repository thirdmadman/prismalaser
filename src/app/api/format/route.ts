import { formatSchema } from '@prisma/internals';

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  let formattedSchemaString = null;
  let isOk = false;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const schemaString = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!schemaString?.text) {
      throw new Error('No schema string provided');
    }

    const formatSchemaResult = await formatSchema({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      schemas: [['schema.prisma', schemaString.text]],
    });

    if (!formatSchemaResult[0]?.[1]) {
      throw new Error('Unable to format schema');
    }

    formattedSchemaString = formatSchemaResult[0][1];

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
