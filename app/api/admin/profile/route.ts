// import { NextRequest, NextResponse } from 'next/server';

// const laravelApiUrl = process.env.NEXT_PUBLIC_API_URL;

// export async function GET(request: NextRequest) {
//   try {
//     const response = await fetch(`${laravelApiUrl}/api/admin/profile`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         // Add authorization header if needed
//         // 'Authorization': `Bearer ${token}`
//       },
//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: 'Failed to fetch admin profile' },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching admin profile:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }