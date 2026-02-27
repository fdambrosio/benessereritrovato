import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  const password = 'benessere2024!';

  if (!envHash) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'ADMIN_PASSWORD_HASH not set in environment',
      envHash: undefined,
    });
  }

  const isValid = await bcrypt.compare(password, envHash);

  return NextResponse.json({
    status: isValid ? 'SUCCESS' : 'INVALID',
    message: isValid
      ? 'Password matches successfully'
      : 'Password does not match',
    envHashSet: !!envHash,
    envHashFull: envHash,
    envHashLength: envHash.length,
    passwordTested: password,
    bcryptCompareResult: isValid,
  });
}
