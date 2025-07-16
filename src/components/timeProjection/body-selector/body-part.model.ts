export type BodyPartKey =
  | 'armpits'
  | 'legs'
  | 'arms'
  | 'shoulders'
  | 'back'
  | 'stomach'
  | 'torso'
  | 'head'
  | 'bikini';

export interface BodyPart {
  key: BodyPartKey;
  label: string;
  anagenPercentage: number;
  baseTime: number;
}

export const BodyParts: Record<BodyPartKey, BodyPart> = {
  head:      { key: 'head', label: 'Kopf', anagenPercentage: 85, baseTime: 1 },
  arms:      { key: 'arms', label: 'Arme', anagenPercentage: 35, baseTime: 1 },
  legs:      { key: 'legs', label: 'Beine', anagenPercentage: 35, baseTime: 1.5 },
  back:      { key: 'back', label: 'Rücken', anagenPercentage: 35, baseTime: 2 },
  torso:     { key: 'torso', label: 'Brust / Oberkörper', anagenPercentage: 12, baseTime: 1.8 },
  shoulders: { key: 'shoulders', label: 'Schultern', anagenPercentage: 35, baseTime: 1 },
  stomach:   { key: 'stomach', label: 'Bauch', anagenPercentage: 35, baseTime: 1 },
  armpits:   { key: 'armpits', label: 'Achseln', anagenPercentage: 60, baseTime: 0.5 },
  bikini:    { key: 'bikini', label: 'Bikinizone', anagenPercentage: 60, baseTime: 0.7 },
};

export const BODY_PARTS: BodyPart[] = Object.values(BodyParts);
