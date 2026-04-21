import { NextRequest, NextResponse } from 'next/server';
import { STYLES, generateCollage } from '@/lib/styles';

export async function POST(req: NextRequest) {
  try {
    const { styles, subject } = await req.json();
    const artworkSubject = subject || 'a serene Japanese garden with cherry blossoms and a wooden bridge over still water';

    const result = await generateCollage(styles, artworkSubject);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Collage API error:', message);
    return NextResponse.json(
      { error: 'Generation failed', details: message },
      { status: 500 }
    );
  }
}