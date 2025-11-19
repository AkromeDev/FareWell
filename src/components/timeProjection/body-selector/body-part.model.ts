export type BodyPartKey =
  | 'armpits'
  | 'legs'
  | 'arms'
  | 'shoulders'
  | 'back'
  | 'stomach'
  | 'torso'
  | 'head'
  | 'intim'
  | 'monobrow'
  | 'beardContour';

export interface BodyPart {
  key: BodyPartKey;
  label: string;
  anagenPercentage: number;
  maxMultiplier: number;
  estimatedTotalHours: number;
}

export const BodyParts: Record<BodyPartKey, BodyPart> = {
  head:      { key: 'head', label: 'Kopf', anagenPercentage: 85, maxMultiplier: 2, estimatedTotalHours: 10 },
  arms:      { key: 'arms', label: 'Arme', anagenPercentage: 20, maxMultiplier: 4, estimatedTotalHours: 10 },
  legs:      { key: 'legs', label: 'Beine', anagenPercentage: 20, maxMultiplier: 4, estimatedTotalHours: 15 },
  back:      { key: 'back', label: 'Rücken', anagenPercentage: 35, maxMultiplier: 4, estimatedTotalHours: 20 },
  torso:     { key: 'torso', label: 'Brust / Oberkörper', anagenPercentage: 25, maxMultiplier: 2, estimatedTotalHours: 15 },
  shoulders: { key: 'shoulders', label: 'Schultern', anagenPercentage: 35, maxMultiplier: 2, estimatedTotalHours: 8 },
  stomach:   { key: 'stomach', label: 'Bauch', anagenPercentage: 25, maxMultiplier: 2, estimatedTotalHours: 10 },
  armpits:   { key: 'armpits', label: 'Achseln', anagenPercentage: 60, maxMultiplier: 2, estimatedTotalHours: 5 },
  intim:    { key: 'intim', label: 'Intimbereich', anagenPercentage: 60, maxMultiplier: 2, estimatedTotalHours: 7 },
  monobrow:  { key: 'monobrow', label: 'Monobraue', anagenPercentage: 85, maxMultiplier: 1, estimatedTotalHours: 0.5 },
  beardContour: { key: 'beardContour', label: 'Bartkontur', anagenPercentage: 85, maxMultiplier: 2, estimatedTotalHours: 5 },
};



export const BODY_PARTS: BodyPart[] = Object.values(BodyParts);
