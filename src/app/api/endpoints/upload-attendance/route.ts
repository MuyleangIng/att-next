import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const response = await fetch('http://localhost:8000/api/v1/api/v1/attendance/upload-attendance', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.detail || 'Upload failed')
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}