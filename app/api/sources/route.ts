import { NextResponse } from 'next/server';
import { fetchSources, getD1Database, insertSource } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getD1Database();
    const sources = await fetchSources(db);
    return NextResponse.json({
      success: true,
      data: sources,
      sources,
      count: sources.length,
    });
  } catch (error) {
    console.error('Failed to get sources:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Source name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!body.baseUrl || typeof body.baseUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Base URL is required and must be a string' },
        { status: 400 }
      );
    }

    const db = await getD1Database();
    const newSource = await insertSource(db, {
      name: body.name.trim(),
      baseUrl: body.baseUrl.trim(),
      slug: body.slug ? body.slug.trim() : undefined,
      feedUrl: body.feedUrl ? body.feedUrl.trim() : undefined,
      discoveryType: body.discoveryType,
      pollingIntervalMinutes: body.pollingIntervalMinutes ? Number(body.pollingIntervalMinutes) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      healthStatus: body.healthStatus,
      extractionRulesJson: body.extractionRulesJson,
    });

    return NextResponse.json(
      {
        success: true,
        data: newSource,
        source: newSource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create source:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
