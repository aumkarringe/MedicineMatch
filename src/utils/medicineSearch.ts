import { Medicine } from '@/types/medicine';

// Extract keywords from user input
export const extractKeywords = (text: string): string[] => {
  const stopWords = ['i', 'have', 'am', 'feel', 'feeling', 'experiencing', 'with', 'and', 'the', 'a', 'an', 'my', 'is', 'are', 'for', 'of', 'to', 'in'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
};

// Search medicines based on keywords matching the "Uses" field
export const searchMedicinesByUsage = (
  medicines: Medicine[],
  keywords: string[]
): Medicine[] => {
  if (keywords.length === 0) return [];

  const results = medicines
    .map(medicine => {
      const usesLower = medicine.uses.toLowerCase();
      
      // Count how many keywords match in the uses field
      const matchCount = keywords.filter(keyword => 
        usesLower.includes(keyword)
      ).length;

      return {
        medicine,
        score: matchCount
      };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => {
      // Sort by match score first, then by rating
      if (b.score !== a.score) return b.score - a.score;
      return (b.medicine.rating || 0) - (a.medicine.rating || 0);
    })
    .map(result => result.medicine);

  return results;
};

// Filter medicines by gender (if needed in future)
export const filterByGender = (
  medicines: Medicine[],
  gender: 'all' | 'male' | 'female'
): Medicine[] => {
  if (gender === 'all') return medicines;
  // This dataset doesn't have gender info, so return all for now
  return medicines;
};

// Sort medicines by rating
export const sortByRating = (medicines: Medicine[]): Medicine[] => {
  return [...medicines].sort((a, b) => (b.rating || 0) - (a.rating || 0));
};
