export interface Medicine {
  name: string;
  composition: string;
  uses: string;
  sideEffects: string;
  imageUrl: string;
  manufacturer: string;
  excellentReview: number;
  averageReview: number;
  poorReview: number;
  rating?: number;
}
