import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'sonar_samples.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    
    if (lines.length === 0) {
      return NextResponse.json(
        { error: 'No samples available' },
        { status: 404 }
      );
    }
    
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    const parts = randomLine.split(',');
    const features = parts.slice(0, 60).map(Number);
    const actualLabel = parts[60]?.trim() || '';
    
    return NextResponse.json({ 
      features,
      actualLabel: actualLabel === 'R' ? 'Rock' : actualLabel === 'M' ? 'Mine' : 'Unknown'
    });
  } catch (error) {
    console.error('Error loading sample:', error);
    return NextResponse.json(
      { error: 'Failed to load sample' },
      { status: 500 }
    );
  }
}
