import { getDMMF } from '@prisma/internals';
import stripAnsi from 'strip-ansi';
import { TErrorTypes } from './types';
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
    let errType: TErrorTypes;

    if (message.includes('error: ')) {
      errors = parseDMMFError(message);
      errType = TErrorTypes.Prisma;
    } else {
      console.error(err);

      errors = message;
      errType = TErrorTypes.Other;
    }
    isError = true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    result = { errors, type: errType };
  }

  const resultString = JSON.stringify(result);

  return { resultString, isError };
}
