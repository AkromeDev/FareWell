import {
  TaskDefinition,
  TaskRecurrence,
  TaskType,
  TaskUserId,
  Weekday,
  rec,
} from '../models';
import {
  DEEP_CLEAN_ZONES,
  GENERAL_ELIGIBLE,
  MASSAGE_ELIGIBLE,
  PLAN_ID,
  PLAN_VERSION,
} from '../config/task-access.config';

/**
 * Canonical seed data derived from `Salon_Task_and_Cleaning_Plan.md`.
 *
 * One definition exists for every task row in the plan. Category = the plan's
 * section/room, task names are kept verbatim, and the "Every (days)" column is
 * mapped to the appropriate recurrence kind (numbers → fixedInterval incl.
 * decimals; `after …` → event; `on use days` → scheduledWeekdays; `check N` →
 * checkInterval; seasonal/rotating handled explicitly).
 *
 * Ids are stable slugs based on category + task, independent of the display
 * name, so wording can be edited later without losing completion history.
 *
 * Bump {@link SEED_VERSION} whenever tasks are added/removed/changed so stored
 * state can be merged by id (see TaskDataMigrationService).
 */
export const SEED_VERSION = '2026-07-16';

interface SeedInput {
  id: string;
  name: string;
  recurrence: TaskRecurrence;
  type?: TaskType;
  primaryOwner?: TaskUserId;
  eligibleUsers?: TaskUserId[];
  description?: string;
  notes?: string;
  preferredWeekday?: Weekday;
}

const orderCounters = new Map<string, number>();

function build(category: string, input: SeedInput): TaskDefinition {
  const type: TaskType = input.type ?? (category === 'massageraum' ? 'massage' : 'general');
  const eligibleUsers =
    input.eligibleUsers ?? (type === 'massage' ? MASSAGE_ELIGIBLE : GENERAL_ELIGIBLE);
  const order = (orderCounters.get(category) ?? 0) + 1;
  orderCounters.set(category, order);
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    category,
    type,
    eligibleUsers: [...eligibleUsers],
    primaryOwner: input.primaryOwner,
    recurrence: input.recurrence,
    active: true,
    notes: input.notes,
    preferredWeekday: input.preferredWeekday,
    displayOrder: order,
    sourcePlanId: PLAN_ID,
    sourcePlanVersion: PLAN_VERSION,
  };
}

/** Curried builder for one category, keeps the seed list readable. */
function section(category: string) {
  return (input: SeedInput): TaskDefinition => build(category, input);
}

const empfang = section('empfang');
const flur = section('flur');
const laserraum = section('laserraum');
const elektrolyseraum = section('elektrolyseraum');
const massageraum = section('massageraum');
const kueche = section('kueche');
const wc = section('wc');
const pflanzen = section('pflanzen');
const salon = section('salon');
const mehrwert = section('mehrwert');

export const TASK_SEED: TaskDefinition[] = [
  // --- Empfang & Wartebereich --------------------------------------------
  empfang({ id: 'empfang--welcome-desk', name: 'Wipe + disinfect welcome desk, iPad, card terminal (high touch)', recurrence: rec.fixed(1) }),
  empfang({ id: 'empfang--fatboys', name: 'Plump Fatboys, straighten sofa cushions and throw', recurrence: rec.fixed(7) }),
  empfang({ id: 'empfang--glass-door', name: 'Wipe the glass entrance door (fingerprints on the logo)', recurrence: rec.fixed(30) }),
  empfang({ id: 'empfang--drinks', name: 'Refill the drinks => Sparkling water, water, Apfel Schorle', recurrence: rec.fixed(0.5) }),
  empfang({ id: 'empfang--flyers', name: 'Tidy flyers, price cards, business cards; replace worn ones', recurrence: rec.fixed(14) }),
  empfang({ id: 'empfang--vacuum-sofa', name: 'Vacuum sofa, check between cushions', recurrence: rec.fixed(14) }),
  empfang({ id: 'empfang--dust-desk', name: 'Dust desk, shelves, decor, picture frames', recurrence: rec.fixed(30) }),
  empfang({ id: 'empfang--refill-cards', name: 'Refill business cards and price lists', recurrence: rec.fixed(30) }),
  empfang({ id: 'empfang--entrance-window', name: 'Clean Entrance window and logo', recurrence: rec.fixed(30) }),

  // --- Flur ---------------------------------------------------------------
  flur({ id: 'flur--door-handles', name: 'Disinfect all door handles along the hallway', recurrence: rec.fixed(30) }),
  flur({ id: 'flur--vacuum-carpet', name: 'Vacuum carpet', recurrence: rec.fixed(7), notes: 'Daily in wet weather.' }),
  flur({ id: 'flur--spot-clean-carpet', name: 'Spot clean carpet stains', recurrence: rec.check(30), notes: 'Look every 30 days, act when needed.' }),
  flur({ id: 'flur--dust-skirting', name: 'Dust skirting boards, light switches, wall decor', recurrence: rec.fixed(30) }),
  flur({ id: 'flur--shampoo-carpet', name: 'Deep clean / shampoo carpet spots', recurrence: rec.fixed(90) }),

  // --- Laserraum ----------------------------------------------------------
  laserraum({ id: 'laserraum--paper-cover', name: 'Change paper cover of the armchair', recurrence: rec.event('client') }),
  laserraum({ id: 'laserraum--disinfect-devices', name: 'Disinfect laser handpiece and microneedling device per protocol', recurrence: rec.event('client') }),
  laserraum({ id: 'laserraum--goggles', name: 'Disinfect laser goggles (client + operator)', recurrence: rec.eventFollowUp('use', 1), notes: 'After use, plus a recheck 1 day after the most recent use.' }),
  laserraum({ id: 'laserraum--wipe-hocker-cart', name: 'Wipe white leather hocker and cart surfaces', recurrence: rec.fixed(3) }),
  laserraum({ id: 'laserraum--empty-waste', name: 'Empty treatment waste (clean if necessary)', recurrence: rec.fixed(1) }),
  laserraum({ id: 'laserraum--restock-cart', name: 'Restock cart: cotton, gloves, masks, aloe, disinfectant, cooling and ultrasound gel', recurrence: rec.fixed(1) }),
  laserraum({ id: 'laserraum--mop-floor', name: 'Mop laminate floor', recurrence: rec.fixed(7) }),
  laserraum({ id: 'laserraum--vacuum-floor', name: 'Vacuum laminate floor', recurrence: rec.fixed(3.5) }),
  laserraum({ id: 'laserraum--towels', name: 'Take dirty towels to laundry, lay out fresh', recurrence: rec.fixed(1) }),
  laserraum({ id: 'laserraum--ring-light', name: 'Wipe ring light / magnifying lamp, disinfect handle', recurrence: rec.fixed(30) }),
  laserraum({ id: 'laserraum--dust-tv', name: 'Dust TV, TV table, cupboard top; wipe cupboard handles', recurrence: rec.fixed(30) }),
  laserraum({ id: 'laserraum--mini-fridge-exterior', name: 'Wipe mini fridge exterior', recurrence: rec.fixed(30) }),
  laserraum({ id: 'laserraum--clean-tv-windows', name: 'Clean TV screen and windows', recurrence: rec.fixed(90) }),
  laserraum({ id: 'laserraum--fridge-expiry', name: 'Check product expiry inside the mini fridge', recurrence: rec.fixed(90) }),

  // --- Elektrolyseraum ----------------------------------------------------
  elektrolyseraum({ id: 'elektrolyseraum--paper-cover', name: 'Change paper cover of the armchair', recurrence: rec.event('client') }),
  elektrolyseraum({ id: 'elektrolyseraum--disinfect-device', name: 'Disinfect device, probe holder; check needle / probe stock', recurrence: rec.event('client') }),
  elektrolyseraum({ id: 'elektrolyseraum--sterilizer', name: 'Run + verify sterilizer, check forceps and tools, log it', recurrence: rec.fixed(1) }),
  elektrolyseraum({ id: 'elektrolyseraum--restock-cart', name: 'Restock cart: sterile probes, cotton, gloves, aftercare (Aloe, Bepanthen), disinfectant', recurrence: rec.fixed(1) }),
  elektrolyseraum({ id: 'elektrolyseraum--bin-surfaces', name: 'Empty + disinfect bin; wipe hocker, chair, cart', recurrence: rec.fixed(1) }),
  elektrolyseraum({ id: 'elektrolyseraum--mop-floor', name: 'Mop laminate floor', recurrence: rec.fixed(7) }),
  elektrolyseraum({ id: 'elektrolyseraum--dust-cupboard', name: 'Dust cupboard and sills', recurrence: rec.fixed(7) }),
  elektrolyseraum({ id: 'elektrolyseraum--clean-windows', name: 'Clean windows', recurrence: rec.fixed(90) }),

  // --- Massageraum (massage) — freelancers Anna (Mo, Mi), Nika (Do) -------
  massageraum({ id: 'massageraum--disinfect-liege', name: 'Disinfect massage Liege + fresh sheets', recurrence: rec.event('use') }),
  massageraum({ id: 'massageraum--restock-before', name: 'Restock towels, couch roll, oil, tissues, disinfectant before the shift', recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'before' }) }),
  massageraum({ id: 'massageraum--launder-after', name: 'Launder towels and sheets after each shift', recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'after' }) }),
  massageraum({ id: 'massageraum--air-room', name: 'Air the room, set light and scent before the shift', recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'before' }) }),
  massageraum({ id: 'massageraum--empty-bin-mop', name: 'Empty bin, mop floor', recurrence: rec.weekdays({ useDayGroup: 'all' }) }),
  massageraum({ id: 'massageraum--mop-oil', name: 'Mop the floor (cleaning oil stains)', recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'after' }) }),
  massageraum({ id: 'massageraum--dust-surfaces', name: 'Dust surfaces and shelves', recurrence: rec.fixed(7) }),

  // --- Küche --------------------------------------------------------------
  kueche({ id: 'kueche--dishwasher', name: 'Load / run and empty dishwasher; wipe counters and sink', recurrence: rec.fixed(1) }),
  kueche({ id: 'kueche--rubbish', name: 'Take out rubbish and recycling (Mülltrennung)', recurrence: rec.fixed(1), primaryOwner: 'mojo' }),
  kueche({ id: 'kueche--fruit-basket', name: 'Refill fruit basket, remove overripe fruit', recurrence: rec.fixed(3), primaryOwner: 'mojo' }),
  kueche({ id: 'kueche--dish-cloths', name: 'Wash dish cloths', recurrence: rec.fixed(3), primaryOwner: 'mojo', notes: 'Replace the sponge every 7 days.' }),
  kueche({ id: 'kueche--microwave', name: 'Clean microwave interior', recurrence: rec.fixed(90) }),
  kueche({ id: 'kueche--restock-supplies', name: 'Restock paper towels, tea, coffee, sugar, SodaStream bottles / CO2', recurrence: rec.fixed(7), primaryOwner: 'mojo' }),
  kueche({ id: 'kueche--wipe-fridge', name: 'Wipe fridge and its shelf', recurrence: rec.fixed(7) }),
  kueche({ id: 'kueche--descale-tap', name: 'Descale the tap and sink (limescale is showing)', recurrence: rec.fixed(14) }),
  kueche({ id: 'kueche--toaster-tray', name: 'Clean toaster crumb tray', recurrence: rec.fixed(14), primaryOwner: 'mojo' }),
  kueche({ id: 'kueche--descale-appliances', name: 'Descale Wasserkocher, SodaStream nozzle, run dishwasher cleaning cycle', recurrence: rec.fixed(60) }),

  // --- WC & Waschraum -----------------------------------------------------
  wc({ id: 'wc--toilets', name: 'Clean + disinfect toilets, urinal, seats, flush buttons', recurrence: rec.fixed(3) }),
  wc({ id: 'wc--inner-stains', name: 'Clean possible inner toilet stains', recurrence: rec.fixed(1) }),
  wc({ id: 'wc--restock-paper', name: 'Restock toilet paper and wall paper towels', recurrence: rec.fixed(14) }),
  wc({ id: 'wc--refill-soap', name: 'Refill hand soap (Sagrotan + copper dispenser) and hand disinfectant', recurrence: rec.fixed(14) }),
  wc({ id: 'wc--sinks-mirrors', name: 'Clean sinks, taps, mirrors', recurrence: rec.fixed(7) }),
  wc({ id: 'wc--empty-bins', name: 'Empty bins', recurrence: rec.fixed(1) }),
  wc({ id: 'wc--mop-floor', name: 'Mop and disinfect floor', recurrence: rec.fixed(7) }),
  wc({ id: 'wc--wipe-tiles', name: 'Wipe tiles, splash areas, door handles', recurrence: rec.fixed(14) }),
  wc({ id: 'wc--descale', name: 'Descale taps and sinks', recurrence: rec.fixed(14) }),
  wc({ id: 'wc--deep-clean-grout', name: 'Deep clean grout and behind the toilet', recurrence: rec.fixed(30) }),

  // --- Pflanzen (winter Nov–Feb: roughly halve watering) -----------------
  pflanzen({ id: 'pflanzen--dracaena-water', name: 'Drachenbaum / Dracaena (×2): Water', recurrence: rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] }), notes: 'Reduced watering (every 14 days) in winter, Nov–Feb.' }),
  pflanzen({ id: 'pflanzen--dracaena-dust', name: 'Drachenbaum / Dracaena (×2): Dust leaves, trim brown tips', recurrence: rec.fixed(14) }),
  pflanzen({ id: 'pflanzen--strelitzie-water', name: 'Strelitzie / Paradiesvogelblume: Water', recurrence: rec.seasonal(6, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 12 }] }), notes: 'Roughly halve watering in winter, Nov–Feb.' }),
  pflanzen({ id: 'pflanzen--strelitzie-wipe', name: 'Strelitzie / Paradiesvogelblume: Wipe big leaves, rotate toward light', recurrence: rec.fixed(10) }),
  pflanzen({ id: 'pflanzen--monstera-water', name: 'Fensterblatt / Monstera: Water when top 3 cm dry', recurrence: rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] }), notes: 'Water when the top 3 cm are dry; roughly halve in winter, Nov–Feb.' }),
  pflanzen({ id: 'pflanzen--monstera-wipe', name: 'Fensterblatt / Monstera: Wipe leaves, tidy aerial roots', recurrence: rec.fixed(14) }),
  pflanzen({ id: 'pflanzen--philodendron-water', name: 'Hänge-Philodendron: Water', recurrence: rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] }), notes: 'Roughly halve watering in winter, Nov–Feb.' }),
  pflanzen({ id: 'pflanzen--philodendron-wipe', name: 'Hänge-Philodendron: Wipe leaves, trim leggy vines', recurrence: rec.fixed(21) }),
  pflanzen({ id: 'pflanzen--sansevieria-water', name: 'Bogenhanf / Sansevieria (×2): Water sparingly', recurrence: rec.seasonal(18, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 36 }] }), notes: 'Overwatering rots it. Roughly halve in winter, Nov–Feb.' }),
  pflanzen({ id: 'pflanzen--sansevieria-wipe', name: 'Bogenhanf / Sansevieria (×2): Wipe leaves', recurrence: rec.fixed(21) }),
  pflanzen({ id: 'pflanzen--remove-dead-leaves', name: 'All plants: Remove dead / yellow leaves', recurrence: rec.fixed(7) }),
  pflanzen({ id: 'pflanzen--pest-check', name: 'All plants: Check for pests (spider mites, scale)', recurrence: rec.fixed(30) }),
  pflanzen({ id: 'pflanzen--fertilize', name: 'All plants: Fertilize', recurrence: rec.seasonal(21, { activeMonths: [4, 5, 6, 7, 8, 9] }), notes: 'Fertilize only from April to September.' }),
  pflanzen({ id: 'pflanzen--repot', name: 'All plants: Repot / refresh top soil', recurrence: rec.fixed(365) }),

  // --- Ganzer Salon -------------------------------------------------------
  salon({ id: 'salon--door-handles', name: 'Disinfect all door handles, switches, high touch points', recurrence: rec.fixed(30) }),
  salon({ id: 'salon--ventilate', name: 'Ventilate all rooms', recurrence: rec.fixed(1), primaryOwner: 'mojo' }),
  salon({ id: 'salon--laundry', name: 'Laundry: wash, dry, fold towels, headbands, covers', recurrence: rec.fixed(1), primaryOwner: 'mojo' }),
  salon({ id: 'salon--charge-devices', name: 'Charge iPad, terminal, devices, magnifying visor', recurrence: rec.fixed(1), primaryOwner: 'mojo' }),
  salon({ id: 'salon--interior-windows', name: 'Interior windows', recurrence: rec.fixed(60) }),
  salon({ id: 'salon--check-bulbs', name: 'Check / replace dead bulbs and the lit counter LED strip', recurrence: rec.fixed(14), primaryOwner: 'mojo' }),
  salon({ id: 'salon--first-aid', name: 'First aid kit and fire extinguisher check', recurrence: rec.fixed(90) }),

  // --- Wertschöpfende Aufgaben (Nicole's gap-filler jobs) -----------------
  mehrwert({ id: 'mehrwert--prep-rooms', name: "Prep tomorrow's rooms: lay out tools, restock trolleys, pull client files and consent forms, note skin type and allergies", recurrence: rec.fixed(1), primaryOwner: 'nicolita' }),
  mehrwert({ id: 'mehrwert--aftercare', name: 'Send aftercare follow up messages to recent clients (for first-timer clients)', recurrence: rec.fixed(1), primaryOwner: 'nicolita', notes: "In FareWell's voice." }),
  mehrwert({ id: 'mehrwert--review-request', name: 'Ask happy clients for a Google review or hand them a review card', recurrence: rec.event('treatment'), primaryOwner: 'nicolita' }),
  mehrwert({ id: 'mehrwert--photos', name: 'Capture clean before / after photos and short clips (with consent) for Instagram', recurrence: rec.adHoc(), primaryOwner: 'nicolita', notes: 'When quiet.' }),
  mehrwert({ id: 'mehrwert--deep-clean-rotation', name: 'Deep clean rotation: one zone gets the thorough treatment each week', recurrence: rec.rotating(7, DEEP_CLEAN_ZONES), primaryOwner: 'nicolita' }),
];

/**
 * Detects duplicate stable ids at module load. In dev this throws a clear
 * error; in production it logs and de-duplicates (first definition wins) so a
 * seed mistake can never break the page.
 */
export function assertUniqueSeedIds(defs: TaskDefinition[] = TASK_SEED): TaskDefinition[] {
  const seen = new Map<string, TaskDefinition>();
  const duplicates: string[] = [];
  for (const d of defs) {
    if (seen.has(d.id)) {
      duplicates.push(d.id);
      continue;
    }
    seen.set(d.id, d);
  }
  if (duplicates.length > 0) {
    const message = `[tasks] Duplicate seed task ids: ${[...new Set(duplicates)].join(', ')}`;
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      throw new Error(message);
    }
    console.error(message);
  }
  return [...seen.values()];
}

declare const ngDevMode: boolean | undefined;
