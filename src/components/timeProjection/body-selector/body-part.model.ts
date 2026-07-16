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
  labelEn: string;
  anagenPercentage: number;
  maxMultiplier: number;
  estimatedTotalHours: number;
}

export const BodyParts: Record<BodyPartKey, BodyPart> = {
  head:      { key: 'head', label: 'Kopf', labelEn: 'Head', anagenPercentage: 85, maxMultiplier: 2, estimatedTotalHours: 10 },
  arms:      { key: 'arms', label: 'Arme', labelEn: 'Arms', anagenPercentage: 20, maxMultiplier: 4, estimatedTotalHours: 10 },
  legs:      { key: 'legs', label: 'Beine', labelEn: 'Legs', anagenPercentage: 20, maxMultiplier: 4, estimatedTotalHours: 15 },
  back:      { key: 'back', label: 'Rücken', labelEn: 'Back', anagenPercentage: 35, maxMultiplier: 4, estimatedTotalHours: 20 },
  torso:     { key: 'torso', label: 'Brust / Oberkörper', labelEn: 'Chest / upper body', anagenPercentage: 25, maxMultiplier: 2, estimatedTotalHours: 15 },
  shoulders: { key: 'shoulders', label: 'Schultern', labelEn: 'Shoulders', anagenPercentage: 35, maxMultiplier: 2, estimatedTotalHours: 8 },
  stomach:   { key: 'stomach', label: 'Bauch', labelEn: 'Stomach', anagenPercentage: 25, maxMultiplier: 2, estimatedTotalHours: 10 },
  armpits:   { key: 'armpits', label: 'Achseln', labelEn: 'Underarms', anagenPercentage: 60, maxMultiplier: 2, estimatedTotalHours: 5 },
  intim:    { key: 'intim', label: 'Intimbereich', labelEn: 'Bikini area', anagenPercentage: 60, maxMultiplier: 2, estimatedTotalHours: 7 },
  monobrow:  { key: 'monobrow', label: 'Monobraue', labelEn: 'Monobrow', anagenPercentage: 85, maxMultiplier: 1, estimatedTotalHours: 0.5 },
  beardContour: { key: 'beardContour', label: 'Bartkontur', labelEn: 'Beard contour', anagenPercentage: 85, maxMultiplier: 2, estimatedTotalHours: 5 },
};



export const BODY_PARTS: BodyPart[] = Object.values(BodyParts);
