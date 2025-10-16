import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Store, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { findNearbyPharmacies } from '@/utils/aiRecommendation';
import { useToast } from '@/hooks/use-toast';

export const PharmacyFinder = () => {
  const [location, setLocation] = useState('');
  const [pharmacies, setPharmacies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter your location",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const results = await findNearbyPharmacies(location);
      setPharmacies(results);
      toast({
        title: "Pharmacies found!",
        description: `Found ${results.length} pharmacies near ${location}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find pharmacies. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          toast({
            title: "Location detected",
            description: "Using your current location"
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Find Nearby Pharmacies</h2>
          </div>
          <p className="text-muted-foreground">
            AI-powered pharmacy locator to help you find medicines near you
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Enter your city or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              className="gap-2"
            >
              <Navigation size={18} />
              Use My Location
            </Button>
            <Button onClick={handleSearch} disabled={loading} className="gap-2">
              <Search size={18} />
              {loading ? 'Searching...' : 'Find Pharmacies'}
            </Button>
          </div>
        </Card>

        {pharmacies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Store className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{pharmacy}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin size={14} />
                        Near {location}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {pharmacies.length === 0 && location && !loading && (
          <Card className="p-8 text-center">
            <Store size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Enter a location to find nearby pharmacies
            </p>
          </Card>
        )}
      </div>
    </motion.section>
  );
};
