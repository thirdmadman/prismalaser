import { getDMMF } from '@prisma/internals';
import stripAnsi from 'strip-ansi';
import { ErrorTypes } from './types';
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
    let errType: ErrorTypes;

    if (message.includes('error: ')) {
      errors = parseDMMFError(message);
      errType = ErrorTypes.Prisma;
    } else {
      console.error(err);

      errors = message;
      errType = ErrorTypes.Other;
    }
    isError = true;

    result = { errors, type: errType };
  }

  const resultString = JSON.stringify(result);

  return { resultString, isError };
}
