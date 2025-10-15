import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, AlertTriangle, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';
import { Medicine } from '@/types/medicine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface MedicineCardProps {
  medicine: Medicine;
  index: number;
}

export const MedicineCard = ({ medicine, index }: MedicineCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();
  const bookmarked = isBookmarked(medicine.name);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    
    // Confetti for top-rated medicines (rating >= 4.0)
    if (!isExpanded && medicine.rating && medicine.rating >= 4.0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B']
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.05 + i * 0.05, type: 'spring' }}
      >
        <Star
          size={16}
          className={i < Math.round(rating) ? 'fill-warning text-warning' : 'text-muted-foreground/30'}
        />
      </motion.div>
    ));
  };

  const getSideEffectSeverity = () => {
    const sideEffects = medicine.sideEffects.toLowerCase();
    if (sideEffects.includes('severe') || sideEffects.includes('serious')) {
      return 'high';
    }
    if (sideEffects.split(',').length > 5) {
      return 'medium';
    }
    return 'low';
  };

  const severity = getSideEffectSeverity();

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(medicine.name);
      toast({
        title: "Removed from bookmarks",
        description: `${medicine.name} has been removed from your bookmarks`,
      });
    } else {
      addBookmark(medicine);
      toast({
        title: "Added to bookmarks",
        description: `${medicine.name} has been saved to your bookmarks`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all shadow-card hover:shadow-glow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-xl text-foreground">
                  {medicine.name}
                </CardTitle>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className="h-8 w-8"
                  >
                    {bookmarked ? (
                      <BookmarkCheck size={18} className="text-primary fill-primary" />
                    ) : (
                      <Bookmark size={18} />
                    )}
                  </Button>
                </motion.div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(medicine.rating || 0)}
                <span className="ml-2 text-sm font-semibold text-foreground">
                  {medicine.rating?.toFixed(1)}
                </span>
              </div>
              {medicine.rating && medicine.rating >= 4.0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <Badge className="bg-accent text-accent-foreground">
                    <Sparkles size={12} className="mr-1" />
                    Top Rated
                  </Badge>
                </motion.div>
              )}
            </div>
            
            {medicine.imageUrl && (
              <motion.img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="w-20 h-20 object-contain rounded-md bg-background"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Uses:</p>
            <p className="text-sm text-foreground">{medicine.uses}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Manufacturer:</span> {medicine.manufacturer}
            </p>
          </div>

          <motion.button
            onClick={handleExpand}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full justify-between py-2"
            whileHover={{ x: 5 }}
          >
            <span>{isExpanded ? 'Show Less' : 'Show More Details'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Composition:</p>
                  <p className="text-sm text-foreground">{medicine.composition}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-muted-foreground">Side Effects:</p>
                    {severity === 'high' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle size={12} className="mr-1" />
                        High
                      </Badge>
                    )}
                    {severity === 'medium' && (
                      <Badge className="bg-warning text-warning-foreground text-xs">
                        <AlertTriangle size={12} className="mr-1" />
                        Medium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{medicine.sideEffects}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-2 bg-accent/10 rounded-md">
                    <p className="text-xs text-muted-foreground">Excellent</p>
                    <p className="text-lg font-bold text-accent">{medicine.excellentReview}%</p>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded-md">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <p className="text-lg font-bold text-primary">{medicine.averageReview}%</p>
                  </div>
                  <div className="text-center p-2 bg-destructive/10 rounded-md">
                    <p className="text-xs text-muted-foreground">Poor</p>
                    <p className="text-lg font-bold text-destructive">{medicine.poorReview}%</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
