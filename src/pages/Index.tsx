import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { SearchSection } from '@/components/SearchSection';
import { VoiceSearch } from '@/components/VoiceSearch';
import { MedicineCard } from '@/components/MedicineCard';
import { FilterSection } from '@/components/FilterSection';
import { MedicineComparison } from '@/components/MedicineComparison';
import { StatisticsSection } from '@/components/StatisticsSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoadingState } from '@/components/LoadingState';
import { useMedicineData } from '@/hooks/useMedicineData';
import { useBookmarks } from '@/hooks/useBookmarks';
import { extractKeywords, searchMedicinesByUsage, sortByRating } from '@/utils/medicineSearch';
import { Medicine } from '@/types/medicine';
import { AlertCircle, ArrowLeftRight, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { medicines, loading, error } = useMedicineData();
  const { bookmarks } = useBookmarks();
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const keywords = extractKeywords(query);
    const results = searchMedicinesByUsage(medicines, keywords);
    setSearchResults(results);
    setHasSearched(true);
    setShowBookmarks(false);
  };

  const handleVoiceTranscript = (text: string) => {
    setSearchQuery(text);
    handleSearch(text);
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
      {/* Fixed Header with Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeToggle />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="rounded-full w-10 h-10 relative"
          >
            <Bookmark size={20} className={showBookmarks ? 'fill-primary text-primary' : ''} />
            {bookmarks.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {bookmarks.length}
              </Badge>
            )}
          </Button>
        </motion.div>
      </div>
      
      <HeroSection />
      
      
      <div className="text-center mb-4">
        <VoiceSearch onTranscript={handleVoiceTranscript} />
      </div>
      
      <SearchSection onSearch={handleSearch} />

      {/* Bookmarks View */}
      {showBookmarks && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Bookmark className="text-primary" />
              Your Bookmarks ({bookmarks.length})
            </h2>
            
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((medicine, index) => (
                  <MedicineCard
                    key={`bookmark-${medicine.name}-${index}`}
                    medicine={medicine}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-muted-foreground">
                  Start bookmarking medicines to save them for later
                </p>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {hasSearched && !showBookmarks && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-8 px-4"
        >
          <div className="max-w-7xl mx-auto">
            {searchResults.length > 0 ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <FilterSection 
                    sortByRating={handleSortByRating}
                    resultCount={searchResults.length}
                  />
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowComparison(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <ArrowLeftRight size={18} />
                      Compare Medicines
                    </Button>
                  </motion.div>
                </div>
                
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

      {/* Statistics Section - Always visible */}
      {!showBookmarks && (
        <StatisticsSection medicines={medicines} />
      )}

      {/* Medicine Comparison Modal */}
      <MedicineComparison
        medicines={searchResults.length > 0 ? searchResults : medicines.slice(0, 20)}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />

      {!hasSearched && !showBookmarks && (
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
                  title: 'Describe or Speak',
                  description: 'Type or use voice search to tell us your symptoms'
                },
                {
                  step: '2',
                  title: 'AI Matching',
                  description: 'We match your symptoms with medicine uses from our database'
                },
                {
                  step: '3',
                  title: 'Get Results',
                  description: 'View detailed info, compare medicines, and bookmark favorites'
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
