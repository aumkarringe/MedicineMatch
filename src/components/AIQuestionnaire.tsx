import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { QuestionnaireData } from '@/utils/aiRecommendation';

interface AIQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionnaireData) => void;
}

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Cold', 'Sore Throat',
  'Body Pain', 'Nausea', 'Dizziness', 'Fatigue', 'Stomach Pain',
  'Diarrhea', 'Constipation', 'Rash', 'Allergies', 'Insomnia',
  'Chest Pain', 'Shortness of Breath', 'Joint Pain', 'Back Pain',
  'Vomiting', 'Anxiety', 'Depression', 'Muscle Aches'
];

const commonConditions = [
  'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Kidney Disease',
  'Liver Disease', 'Thyroid', 'Arthritis', 'COPD', 'Anemia',
  'Migraine', 'Epilepsy', 'Cancer', 'HIV/AIDS', 'None'
];

const lifestyleFactors = [
  'Smoking', 'Alcohol Consumption', 'Regular Exercise', 'Sedentary Lifestyle',
  'Stress', 'Poor Sleep', 'Vegetarian Diet', 'Vegan Diet', 'Pregnancy', 'Breastfeeding'
];

export const AIQuestionnaire = ({ isOpen, onClose, onSubmit }: AIQuestionnaireProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    symptoms: [],
    severity: 'moderate',
    duration: '',
    age: '',
    weight: '',
    height: '',
    existingConditions: [],
    currentMedications: [],
    allergies: [],
    lifestyleFactors: [],
    previousTreatments: '',
    location: ''
  });
  const [customSymptom, setCustomSymptom] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');
  const [customMedication, setCustomMedication] = useState('');

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      existingConditions: prev.existingConditions.includes(condition)
        ? prev.existingConditions.filter(c => c !== condition)
        : [...prev.existingConditions, condition]
    }));
  };

  const handleLifestyleToggle = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyleFactors: prev.lifestyleFactors?.includes(factor)
        ? prev.lifestyleFactors.filter(f => f !== factor)
        : [...(prev.lifestyleFactors || []), factor]
    }));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !formData.symptoms.includes(customSymptom.trim())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, customSymptom.trim()]
      }));
      setCustomSymptom('');
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !formData.allergies.includes(customAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addCustomMedication = () => {
    if (customMedication.trim() && !formData.currentMedications?.includes(customMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...(prev.currentMedications || []), customMedication.trim()]
      }));
      setCustomMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications?.filter(m => m !== medication) || []
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.symptoms.length > 0;
      case 2:
        return formData.duration && formData.age;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return formData.location && formData.location.trim().length > 0;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
      >
        <Card className="p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X size={20} />
          </Button>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">AI Health Assistant</h2>
            </div>
            <p className="text-muted-foreground">
              Answer a few questions to get personalized medicine recommendations
            </p>
            
            {/* Progress indicator */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">What symptoms are you experiencing?</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSymptoms.map(symptom => (
                    <div
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.symptoms.includes(symptom)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{symptom}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom symptom"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                  />
                  <Button onClick={addCustomSymptom}>Add</Button>
                </div>

                {formData.symptoms.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Selected symptoms:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.symptoms.map(symptom => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-primary/20 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label className="mb-3 block text-base font-semibold">Severity Level</Label>
                  <RadioGroup
                    value={formData.severity}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
                  >
                    {['Mild', 'Moderate', 'Severe'].map(level => (
                      <div key={level} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={level.toLowerCase()} id={level} />
                        <Label htmlFor={level} className="cursor-pointer">{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="mb-2 block">How long have you had these symptoms?</Label>
                  <Input
                    placeholder="e.g., 2 days, 1 week"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Your Age</Label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Weight (kg) - Optional</Label>
                    <Input
                      type="number"
                      placeholder="Enter your weight"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Height (cm) - Optional</Label>
                    <Input
                      type="number"
                      placeholder="Enter your height"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label className="mb-3 block text-base font-semibold">
                    Do you have any existing medical conditions?
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {commonConditions.map(condition => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.existingConditions.includes(condition)}
                          onCheckedChange={() => handleConditionToggle(condition)}
                        />
                        <Label htmlFor={condition} className="cursor-pointer text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-base font-semibold">Any drug allergies?</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Enter allergy"
                      value={customAllergy}
                      onChange={(e) => setCustomAllergy(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                    />
                    <Button onClick={addCustomAllergy}>Add</Button>
                  </div>
                  {formData.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map(allergy => (
                        <span
                          key={allergy}
                          className="px-3 py-1 bg-destructive/20 rounded-full text-sm flex items-center gap-2"
                        >
                          {allergy}
                          <X
                            size={14}
                            className="cursor-pointer"
                            onClick={() => removeAllergy(allergy)}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label className="mb-3 block text-base font-semibold">
                    Are you currently taking any medications?
                  </Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Enter medication name"
                      value={customMedication}
                      onChange={(e) => setCustomMedication(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomMedication()}
                    />
                    <Button onClick={addCustomMedication}>Add</Button>
                  </div>
                  {formData.currentMedications && formData.currentMedications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.currentMedications.map(medication => (
                        <span
                          key={medication}
                          className="px-3 py-1 bg-primary/20 rounded-full text-sm flex items-center gap-2"
                        >
                          {medication}
                          <X
                            size={14}
                            className="cursor-pointer"
                            onClick={() => removeMedication(medication)}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="mb-3 block text-base font-semibold">
                    Lifestyle Factors (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {lifestyleFactors.map(factor => (
                      <div key={factor} className="flex items-center space-x-2">
                        <Checkbox
                          id={factor}
                          checked={formData.lifestyleFactors?.includes(factor)}
                          onCheckedChange={() => handleLifestyleToggle(factor)}
                        />
                        <Label htmlFor={factor} className="cursor-pointer text-sm">
                          {factor}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-base font-semibold">
                    Have you tried any treatments for this condition before?
                  </Label>
                  <Input
                    placeholder="e.g., painkillers, home remedies, etc."
                    value={formData.previousTreatments}
                    onChange={(e) => setFormData(prev => ({ ...prev, previousTreatments: e.target.value }))}
                  />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label className="mb-3 block text-base font-semibold">
                    Your Location (Required for pharmacy recommendations)
                  </Label>
                  <Input
                    placeholder="e.g., New York, USA or enter your city"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    We'll use this to find nearby pharmacies where you can purchase the recommended medicines.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Review Your Information</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Symptoms:</strong> {formData.symptoms.join(', ')}</p>
                    <p><strong>Duration:</strong> {formData.duration}</p>
                    <p><strong>Age:</strong> {formData.age}</p>
                    {formData.existingConditions.length > 0 && (
                      <p><strong>Conditions:</strong> {formData.existingConditions.join(', ')}</p>
                    )}
                    {formData.allergies.length > 0 && (
                      <p><strong>Allergies:</strong> {formData.allergies.join(', ')}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft size={18} />
              Back
            </Button>

            {step < 5 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed()}>
                <Sparkles size={18} className="mr-2" />
                Get AI Recommendations
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
