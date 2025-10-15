import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ArrowLeftRight } from 'lucide-react';
import { Medicine } from '@/types/medicine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MedicineComparisonProps {
  medicines: Medicine[];
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineComparison = ({ medicines, isOpen, onClose }: MedicineComparisonProps) => {
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const maxCompare = 3;

  const addToComparison = (medicine: Medicine) => {
    if (selectedMedicines.length < maxCompare && !selectedMedicines.find(m => m.name === medicine.name)) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
  };

  const removeFromComparison = (medicineName: string) => {
    setSelectedMedicines(selectedMedicines.filter(m => m.name !== medicineName));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ArrowLeftRight className="text-primary" />
            Compare Medicines
          </DialogTitle>
          <DialogDescription>
            Select up to {maxCompare} medicines to compare side by side
          </DialogDescription>
        </DialogHeader>

        {/* Selection Area */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Selected for comparison ({selectedMedicines.length}/{maxCompare})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedMedicines.map((medicine) => (
              <motion.div
                key={medicine.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Badge variant="secondary" className="px-3 py-2 text-sm">
                  {medicine.name}
                  <button
                    onClick={() => removeFromComparison(medicine.name)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Available Medicines */}
        {selectedMedicines.length < maxCompare && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">
              Available medicines
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {medicines.map((medicine) => (
                <Button
                  key={medicine.name}
                  variant="outline"
                  size="sm"
                  onClick={() => addToComparison(medicine)}
                  disabled={selectedMedicines.find(m => m.name === medicine.name) !== undefined}
                  className="justify-start text-xs"
                >
                  <Plus size={12} className="mr-1" />
                  {medicine.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedMedicines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${selectedMedicines.length}, 1fr)` }}
          >
            {selectedMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{medicine.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold text-warning">★</span>
                      <span>{medicine.rating?.toFixed(1)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Uses:</p>
                      <p className="text-xs">{medicine.uses}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Composition:</p>
                      <p className="text-xs">{medicine.composition}</p>
                    </div>

                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Side Effects:</p>
                      <p className="text-xs">{medicine.sideEffects}</p>
                    </div>

                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Manufacturer:</p>
                      <p className="text-xs">{medicine.manufacturer}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2">
                      <div className="text-center p-1 bg-accent/10 rounded">
                        <p className="text-xs text-muted-foreground">Excellent</p>
                        <p className="text-sm font-bold text-accent">{medicine.excellentReview}%</p>
                      </div>
                      <div className="text-center p-1 bg-primary/10 rounded">
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p className="text-sm font-bold text-primary">{medicine.averageReview}%</p>
                      </div>
                      <div className="text-center p-1 bg-destructive/10 rounded">
                        <p className="text-xs text-muted-foreground">Poor</p>
                        <p className="text-sm font-bold text-destructive">{medicine.poorReview}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
