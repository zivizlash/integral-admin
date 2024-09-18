import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(req: NextRequest) {
  noStore();
  const env = process.env;

  return NextResponse.json(
    { apiBase: env.NEXT_PUBLIC_API_PATH! },
    { status: 200 }
  );
}
