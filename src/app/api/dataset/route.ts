import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

interface SonarData {
  id: number;
  features: number[];
  label: string;
}

let cachedDataset: SonarData[] | null = null;

function loadDataset(): SonarData[] {
  if (cachedDataset) return cachedDataset;
  
  const filePath = path.join(process.cwd(), 'public', 'sonar.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() !== '');
  
  cachedDataset = lines.map((line, index) => {
    const parts = line.split(',');
    const features = parts.slice(0, 60).map(Number);
    const label = parts[60]?.trim() || 'R';
    return { id: index + 1, features, label };
  });
  
  return cachedDataset;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all';
    const id = searchParams.get('id');
    
    const data = loadDataset();
    
    if (id) {
      const item = data.find(d => d.id === parseInt(id));
      if (!item) {
        return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
      }
      return NextResponse.json({ sample: item });
    }
    
    let filteredData = data;
    if (filter === 'rock') {
      filteredData = data.filter(d => d.label === 'R');
    } else if (filter === 'mine') {
      filteredData = data.filter(d => d.label === 'M');
    }
    
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = filteredData.slice(startIndex, endIndex);
    
    const rockCount = data.filter(d => d.label === 'R').length;
    const mineCount = data.filter(d => d.label === 'M').length;
    
    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      },
      stats: {
        total: data.length,
        rocks: rockCount,
        mines: mineCount
      }
    });
  } catch (error) {
    console.error('Dataset error:', error);
    return NextResponse.json(
      { error: 'Failed to load dataset' },
      { status: 500 }
    );
  }
}
