import { getDMMF } from '@prisma/internals';
import stripAnsi from 'strip-ansi';

import { parseDMMFError } from '.';

export async function validateSchema(schemaString: string) {
  let result = null;
  let isError = false;

  try {
    const dmmf = await getDMMF({ datamodel: schemaString });

    result = dmmf.datamodel;
  } catch (err) {
    const message = stripAnsi((err as Error).message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errors: any;

    if (message.includes('error: ')) {
      errors = parseDMMFError(message);
    } else {
      errors = message;
    }
    isError = true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    result = errors;
  }

  const resultString = JSON.stringify(result);

  return { resultString, isError };
}
