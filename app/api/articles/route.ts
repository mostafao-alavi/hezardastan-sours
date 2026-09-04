import { NextRequest, NextResponse } from 'next/server';
import { fetchArticles, getD1Database } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sourceId = searchParams.get('sourceId') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const db = await getD1Database();
    const articles = await fetchArticles(db, { sourceId, limit, offset });

    return NextResponse.json({
      success: true,
      data: articles,
      articles,
      count: articles.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Failed to get articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
