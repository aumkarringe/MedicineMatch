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
import { AIQuestionnaire } from '@/components/AIQuestionnaire';
import { PharmacyFinder } from '@/components/PharmacyFinder';
import { useMedicineData } from '@/hooks/useMedicineData';
import { useBookmarks } from '@/hooks/useBookmarks';
import { extractKeywords, searchMedicinesByUsage, sortByRating } from '@/utils/medicineSearch';
import { getAIRecommendations, QuestionnaireData } from '@/utils/aiRecommendation';
import { Medicine } from '@/types/medicine';
import { AlertCircle, ArrowLeftRight, Bookmark, Brain, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { medicines, loading, error } = useMedicineData();
  const { bookmarks } = useBookmarks();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showPharmacyFinder, setShowPharmacyFinder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');

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

  const handleQuestionnaireSubmit = async (data: QuestionnaireData) => {
    toast({
      title: "Analyzing your symptoms...",
      description: "AI is finding the best medicines for you"
    });

    try {
      const { recommendations, explanation } = await getAIRecommendations(data, medicines);
      setSearchResults(recommendations);
      setAiExplanation(explanation);
      setHasSearched(true);
      setShowBookmarks(false);
      setShowPharmacyFinder(false);
      
      toast({
        title: "AI Recommendations Ready!",
        description: `Found ${recommendations.length} suitable medicines`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive"
      });
    }
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
            onClick={() => {
              setShowBookmarks(!showBookmarks);
              setShowPharmacyFinder(false);
            }}
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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowPharmacyFinder(!showPharmacyFinder);
              setShowBookmarks(false);
            }}
            className="rounded-full w-10 h-10"
          >
            <Store size={20} className={showPharmacyFinder ? 'text-primary' : ''} />
          </Button>
        </motion.div>
      </div>
      
      <HeroSection />
      
      {/* AI Questionnaire Button */}
      <div className="text-center mb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => setShowQuestionnaire(true)}
            size="lg"
            className="gap-2 text-lg px-8 py-6"
          >
            <Brain size={24} />
            AI Health Assistant
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Get personalized medicine recommendations powered by AI
          </p>
        </motion.div>
      </div>
      
      <div className="text-center mb-4">
        <VoiceSearch onTranscript={handleVoiceTranscript} />
      </div>
      
      <SearchSection onSearch={handleSearch} />

      {/* Pharmacy Finder */}
      {showPharmacyFinder && <PharmacyFinder />}

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

      {hasSearched && !showBookmarks && !showPharmacyFinder && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="py-8 px-4"
        >
          <div className="max-w-7xl mx-auto">
            {aiExplanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <Brain className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI Recommendation</h3>
                    <p className="text-sm text-muted-foreground">{aiExplanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
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
      {!showBookmarks && !showPharmacyFinder && (
        <StatisticsSection medicines={medicines} />
      )}

      {/* Medicine Comparison Modal */}
      <MedicineComparison
        medicines={searchResults.length > 0 ? searchResults : medicines.slice(0, 20)}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />

      {/* AI Questionnaire Modal */}
      <AIQuestionnaire
        isOpen={showQuestionnaire}
        onClose={() => setShowQuestionnaire(false)}
        onSubmit={handleQuestionnaireSubmit}
      />

      {!hasSearched && !showBookmarks && !showPharmacyFinder && (
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
