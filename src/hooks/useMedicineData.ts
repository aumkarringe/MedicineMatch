import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Medicine } from '@/types/medicine';

export const useMedicineData = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/Medicine_Details.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any) => {
              const excellentReview = parseFloat(row['Excellent Review %']) || 0;
              const averageReview = parseFloat(row['Average Review %']) || 0;
              const poorReview = parseFloat(row['Poor Review %']) || 0;
              
              // Calculate weighted rating (0-5 scale)
              const rating = ((excellentReview * 5 + averageReview * 3 + poorReview * 1) / 100) || 0;
              
              return {
                name: row['Medicine Name'] || '',
                composition: row['Composition'] || '',
                uses: row['Uses'] || '',
                sideEffects: row['Side_effects'] || '',
                imageUrl: row['Image URL'] || '',
                manufacturer: row['Manufacturer'] || '',
                excellentReview,
                averageReview,
                poorReview,
                rating: parseFloat(rating.toFixed(1))
              };
            }).filter(med => med.name); // Filter out empty entries
            
            setMedicines(parsedData);
            setLoading(false);
          },
          error: (err) => {
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to load medicine data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { medicines, loading, error };
};
