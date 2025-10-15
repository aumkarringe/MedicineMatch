import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { SearchSection } from '@/components/SearchSection';
import { MedicineCard } from '@/components/MedicineCard';
import { FilterSection } from '@/components/FilterSection';
import { LoadingState } from '@/components/LoadingState';
import { useMedicineData } from '@/hooks/useMedicineData';
import { extractKeywords, searchMedicinesByUsage, sortByRating } from '@/utils/medicineSearch';
import { Medicine } from '@/types/medicine';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const { medicines, loading, error } = useMedicineData();
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    const keywords = extractKeywords(query);
    const results = searchMedicinesByUsage(medicines, keywords);
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSortByRating = () => {
    setSearchResults(sortByRating(searchResults));
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-destructive">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Error loading medicine data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <SearchSection onSearch={handleSearch} />

      {hasSearched && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-8 px-4"
        >
          <div className="max-w-7xl mx-auto">
            {searchResults.length > 0 ? (
              <>
                <FilterSection 
                  sortByRating={handleSortByRating}
                  resultCount={searchResults.length}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((medicine, index) => (
                    <MedicineCard
                      key={`${medicine.name}-${index}`}
                      medicine={medicine}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No medicines found
                </h3>
                <p className="text-muted-foreground">
                  Try searching with different symptoms or keywords
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>
      )}

      {!hasSearched && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-16 px-4 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              How it works
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  step: '1',
                  title: 'Describe Symptoms',
                  description: 'Tell us how you\'re feeling in natural language'
                },
                {
                  step: '2',
                  title: 'AI Matching',
                  description: 'We match your symptoms with medicine uses'
                },
                {
                  step: '3',
                  title: 'Get Results',
                  description: 'View detailed info, ratings, and side effects'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                  className="p-6 bg-card rounded-lg border border-border"
                >
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Index;
