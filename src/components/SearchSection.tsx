import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            How are you feeling?
          </h2>
          <p className="text-muted-foreground">
            Describe your symptoms in natural language and we'll find the right medicine
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="relative"
            animate={{
              boxShadow: isFocused 
                ? '0 0 0 3px hsl(var(--primary) / 0.2)' 
                : '0 0 0 0px hsl(var(--primary) / 0)',
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Textarea
                placeholder="e.g., I have a headache and fever, feeling nauseous..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="min-h-[120px] pr-12 text-base resize-none bg-card border-2 border-border focus:border-primary transition-colors"
              />
              <motion.div
                className="absolute right-4 top-4 text-muted-foreground"
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: isFocused ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles size={20} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mt-4 flex justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              size="lg"
              className="px-8 shadow-lg hover:shadow-xl transition-all"
              disabled={!query.trim()}
            >
              <Search className="mr-2" size={20} />
              Find Medicine
            </Button>
          </motion.div>
        </motion.form>

        {query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Analyzing your symptoms...
            </motion.span>
          </motion.div>
        )}
      </div>
    </section>
  );
};
