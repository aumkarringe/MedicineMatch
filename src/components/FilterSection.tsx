import { motion } from 'framer-motion';
import { ArrowUpDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterSectionProps {
  sortByRating: () => void;
  resultCount: number;
}

export const FilterSection = ({ sortByRating, resultCount }: FilterSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border"
    >
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {resultCount} {resultCount === 1 ? 'medicine' : 'medicines'} found
        </span>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={sortByRating}
          className="gap-2"
        >
          <ArrowUpDown size={16} />
          Sort by Rating
        </Button>
      </motion.div>
    </motion.div>
  );
};
