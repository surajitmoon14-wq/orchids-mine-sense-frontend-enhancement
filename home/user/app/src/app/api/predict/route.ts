import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

interface SonarData {
  features: number[];
  label: string;
}

let trainedModel: {
  weights: number[];
  bias: number;
  mean: number[];
  std: number[];
} | null = null;

let validDataset: SonarData[] | null = null;

function loadTrainingData(): SonarData[] {
  if (validDataset) return validDataset;
  
  const filePath = path.join(process.cwd(), 'public', 'sonar.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() !== '');
  
  validDataset = lines.map(line => {
    const parts = line.split(',');
    const features = parts.slice(0, 60).map(Number);
    const label = parts[60]?.trim() || 'R';
    return { features, label };
  });
  
  return validDataset;
}

function calculateStats(data: SonarData[]) {
  const numFeatures = 60;
  const mean = Array(numFeatures).fill(0);
  const std = Array(numFeatures).fill(0);
  
  for (const sample of data) {
    for (let i = 0; i < numFeatures; i++) {
      mean[i] += sample.features[i];
    }
  }
  for (let i = 0; i < numFeatures; i++) {
    mean[i] /= data.length;
  }
  
  for (const sample of data) {
    for (let i = 0; i < numFeatures; i++) {
      std[i] += Math.pow(sample.features[i] - mean[i], 2);
    }
  }
  for (let i = 0; i < numFeatures; i++) {
    std[i] = Math.sqrt(std[i] / data.length) || 1;
  }
  
  return { mean, std };
}

function standardize(features: number[], mean: number[], std: number[]): number[] {
  return features.map((f, i) => (f - mean[i]) / std[i]);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
}

function trainLogisticRegression(data: SonarData[]) {
  const numFeatures = 60;
  const learningRate = 0.1;
  const iterations = 2000;
  const { mean, std } = calculateStats(data);
  
  const weights = Array(numFeatures).fill(0);
  let bias = 0;
  
  for (let iter = 0; iter < iterations; iter++) {
    for (const sample of data) {
      const y = sample.label === 'M' ? 1 : 0;
      const x = standardize(sample.features, mean, std);
      
      let z = bias;
      for (let j = 0; j < numFeatures; j++) {
        z += weights[j] * x[j];
      }
      const pred = sigmoid(z);
      const error = pred - y;
      
      bias -= learningRate * error;
      for (let j = 0; j < numFeatures; j++) {
        weights[j] -= learningRate * error * x[j];
      }
    }
  }
  
  return { weights, bias, mean, std };
}

function predict(features: number[], model: typeof trainedModel) {
  if (!model) throw new Error('Model not trained');
  
  const x = standardize(features, model.mean, model.std);
  
  let z = model.bias;
  for (let j = 0; j < 60; j++) {
    z += model.weights[j] * x[j];
  }
  
  const prob = sigmoid(z);
  const isMine = prob > 0.5;
  
  return {
    result: isMine ? 'Mine' : 'Rock',
    confidence: isMine ? prob : 1 - prob,
    rawClass: isMine ? 'M' : 'R'
  };
}

function initModel() {
  if (!trainedModel) {
    const data = loadTrainingData();
    trainedModel = trainLogisticRegression(data);
  }
  return trainedModel;
}

function isValidDatasetEntry(features: number[]): boolean {
  const data = loadTrainingData();
  const tolerance = 0.0001;
  
  for (const sample of data) {
    let match = true;
    for (let i = 0; i < 60; i++) {
      if (Math.abs(sample.features[i] - features[i]) > tolerance) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

function validateFeatureRange(features: number[]): { valid: boolean; message?: string } {
  for (let i = 0; i < features.length; i++) {
    if (features[i] < 0 || features[i] > 1) {
      return { 
        valid: false, 
        message: `Feature ${i + 1} must be between 0 and 1. Got: ${features[i]}` 
      };
    }
  }
  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { features, validateStrict } = body;
    
    if (!features || !Array.isArray(features) || features.length !== 60) {
      return NextResponse.json(
        { error: 'Invalid features. Expected exactly 60 numbers.' },
        { status: 400 }
      );
    }
    
    const numericFeatures = features.map((f: unknown) => {
      const num = Number(f);
      if (isNaN(num)) throw new Error('Invalid feature value');
      return num;
    });
    
    const rangeCheck = validateFeatureRange(numericFeatures);
    if (!rangeCheck.valid) {
      return NextResponse.json(
        { error: rangeCheck.message },
        { status: 400 }
      );
    }
    
    const isFromDataset = isValidDatasetEntry(numericFeatures);
    
    if (validateStrict && !isFromDataset) {
      return NextResponse.json(
        { 
          error: 'This data is not from the trained dataset. Please use values from the sonar dataset or load a sample.',
          isFromDataset: false 
        },
        { status: 400 }
      );
    }
    
    const model = initModel();
    const result = predict(numericFeatures, model);
    
    return NextResponse.json({
      result: result.result,
      confidence: Math.round(result.confidence * 100) / 100,
      rawClass: result.rawClass,
      isFromDataset,
      warning: !isFromDataset ? 'Warning: This input is not from the training dataset. Results may be unreliable.' : undefined
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Prediction failed' },
      { status: 500 }
    );
  }
}
