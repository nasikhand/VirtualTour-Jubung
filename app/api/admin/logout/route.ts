import { NextRequest, NextResponse } from 'next/server';

const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${laravelApiUrl}/api/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to logout' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}