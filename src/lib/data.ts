import type { PortfolioData } from './definitions';
import rawData from '../data/portfolio.json';

// This is a type guard to ensure the raw data conforms to the PortfolioData type.
function validateData(data: any): data is PortfolioData {
  // In a real application, you might add more robust validation here,
  // perhaps using a library like Zod, to ensure all required fields exist
  // and are of the correct type. For now, we'll trust the structure.
  return (
    'name' in data &&
    'tagline' in data &&
    'bio' in data &&
    'projects' in data &&
    Array.isArray(data.projects)
  );
}

if (!validateData(rawData)) {
  throw new Error("Invalid portfolio data structure in portfolio.json");
}

export const portfolioData: PortfolioData = rawData;
