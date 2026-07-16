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
 * section/room, and the "Every (days)" column is mapped to the appropriate
 * recurrence kind (numbers → fixedInterval incl. decimals; `after …` → event;
 * `on use days` → scheduledWeekdays; `check N` → checkInterval;
 * seasonal/rotating handled explicitly).
 *
 * Every task is bilingual: `nameDe` is the primary (German) wording shown in
 * the UI, `nameEn` follows the plan's original English wording. Same for
 * `notesDe`/`notesEn`.
 *
 * Ids are stable slugs based on category + task, independent of the display
 * names, so wording can be edited later without losing completion history.
 *
 * Bump {@link SEED_VERSION} whenever tasks are added/removed/changed so stored
 * state can be merged by id (see TaskDataMigrationService).
 */
export const SEED_VERSION = '2026-07-16.1';

interface SeedInput {
  id: string;
  nameDe: string;
  nameEn: string;
  recurrence: TaskRecurrence;
  type?: TaskType;
  primaryOwner?: TaskUserId;
  eligibleUsers?: TaskUserId[];
  notesDe?: string;
  notesEn?: string;
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
    nameDe: input.nameDe,
    nameEn: input.nameEn,
    category,
    type,
    eligibleUsers: [...eligibleUsers],
    primaryOwner: input.primaryOwner,
    recurrence: input.recurrence,
    active: true,
    notesDe: input.notesDe,
    notesEn: input.notesEn,
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
  empfang({
    id: 'empfang--welcome-desk',
    nameDe: 'Empfangstresen, iPad und Kartenterminal abwischen und desinfizieren (häufig berührt)',
    nameEn: 'Wipe and disinfect welcome desk, iPad, card terminal (high touch)',
    recurrence: rec.fixed(1),
  }),
  empfang({
    id: 'empfang--fatboys',
    nameDe: 'Fatboys aufschütteln, Sofakissen und Decke zurechtlegen',
    nameEn: 'Plump Fatboys, straighten sofa cushions and throw',
    recurrence: rec.fixed(7),
  }),
  empfang({
    id: 'empfang--glass-door',
    nameDe: 'Glaseingangstür abwischen (Fingerabdrücke am Logo)',
    nameEn: 'Wipe the glass entrance door (fingerprints on the logo)',
    recurrence: rec.fixed(30),
  }),
  empfang({
    id: 'empfang--drinks',
    nameDe: 'Getränke auffüllen: Sprudelwasser, stilles Wasser, Apfelschorle',
    nameEn: 'Refill the drinks: sparkling water, still water, Apfelschorle',
    recurrence: rec.fixed(0.5),
  }),
  empfang({
    id: 'empfang--flyers',
    nameDe: 'Flyer, Preiskarten und Visitenkarten ordnen, abgenutzte austauschen',
    nameEn: 'Tidy flyers, price cards, business cards; replace worn ones',
    recurrence: rec.fixed(14),
  }),
  empfang({
    id: 'empfang--vacuum-sofa',
    nameDe: 'Sofa absaugen, zwischen den Kissen nachsehen',
    nameEn: 'Vacuum sofa, check between cushions',
    recurrence: rec.fixed(14),
  }),
  empfang({
    id: 'empfang--dust-desk',
    nameDe: 'Tresen, Regale, Deko und Bilderrahmen abstauben',
    nameEn: 'Dust desk, shelves, decor, picture frames',
    recurrence: rec.fixed(30),
  }),
  empfang({
    id: 'empfang--refill-cards',
    nameDe: 'Visitenkarten und Preislisten auffüllen',
    nameEn: 'Refill business cards and price lists',
    recurrence: rec.fixed(30),
  }),
  empfang({
    id: 'empfang--entrance-window',
    nameDe: 'Eingangsfenster und Logo reinigen',
    nameEn: 'Clean entrance window and logo',
    recurrence: rec.fixed(30),
  }),

  // --- Flur ---------------------------------------------------------------
  flur({
    id: 'flur--door-handles',
    nameDe: 'Alle Türklinken im Flur desinfizieren',
    nameEn: 'Disinfect all door handles along the hallway',
    recurrence: rec.fixed(30),
  }),
  flur({
    id: 'flur--vacuum-carpet',
    nameDe: 'Teppich saugen',
    nameEn: 'Vacuum carpet',
    recurrence: rec.fixed(7),
    notesDe: 'Bei nassem Wetter täglich.',
    notesEn: 'Daily in wet weather.',
  }),
  flur({
    id: 'flur--spot-clean-carpet',
    nameDe: 'Teppichflecken punktuell reinigen',
    nameEn: 'Spot clean carpet stains',
    recurrence: rec.check(30),
    notesDe: 'Alle 30 Tage nachsehen, bei Bedarf handeln.',
    notesEn: 'Look every 30 days, act when needed.',
  }),
  flur({
    id: 'flur--dust-skirting',
    nameDe: 'Fußleisten, Lichtschalter und Wanddeko abstauben',
    nameEn: 'Dust skirting boards, light switches, wall decor',
    recurrence: rec.fixed(30),
  }),
  flur({
    id: 'flur--shampoo-carpet',
    nameDe: 'Teppichstellen tiefenreinigen / shampoonieren',
    nameEn: 'Deep clean / shampoo carpet spots',
    recurrence: rec.fixed(90),
  }),

  // --- Laserraum ----------------------------------------------------------
  laserraum({
    id: 'laserraum--paper-cover',
    nameDe: 'Papierauflage des Behandlungsstuhls wechseln',
    nameEn: 'Change paper cover of the armchair',
    recurrence: rec.event('client'),
  }),
  laserraum({
    id: 'laserraum--disinfect-devices',
    nameDe: 'Laser-Handstück und Microneedling-Gerät nach Protokoll desinfizieren',
    nameEn: 'Disinfect laser handpiece and microneedling device per protocol',
    recurrence: rec.event('client'),
  }),
  laserraum({
    id: 'laserraum--goggles',
    nameDe: 'Laserschutzbrillen desinfizieren (Kundschaft und behandelnde Person)',
    nameEn: 'Disinfect laser goggles (client and operator)',
    recurrence: rec.eventFollowUp('use', 1),
    notesDe: 'Nach Gebrauch, plus Nachkontrolle 1 Tag nach der letzten Verwendung.',
    notesEn: 'After use, plus a recheck 1 day after the most recent use.',
  }),
  laserraum({
    id: 'laserraum--wipe-hocker-cart',
    nameDe: 'Weißen Lederhocker und Wagenflächen abwischen',
    nameEn: 'Wipe white leather hocker and cart surfaces',
    recurrence: rec.fixed(3),
  }),
  laserraum({
    id: 'laserraum--empty-waste',
    nameDe: 'Behandlungsabfall leeren (bei Bedarf reinigen)',
    nameEn: 'Empty treatment waste (clean if necessary)',
    recurrence: rec.fixed(1),
  }),
  laserraum({
    id: 'laserraum--restock-cart',
    nameDe: 'Wagen auffüllen: Watte, Handschuhe, Masken, Aloe, Desinfektion, Kühl- und Ultraschallgel',
    nameEn: 'Restock cart: cotton, gloves, masks, aloe, disinfectant, cooling and ultrasound gel',
    recurrence: rec.fixed(1),
  }),
  laserraum({
    id: 'laserraum--mop-floor',
    nameDe: 'Laminatboden wischen',
    nameEn: 'Mop laminate floor',
    recurrence: rec.fixed(7),
  }),
  laserraum({
    id: 'laserraum--vacuum-floor',
    nameDe: 'Laminatboden saugen',
    nameEn: 'Vacuum laminate floor',
    recurrence: rec.fixed(3.5),
  }),
  laserraum({
    id: 'laserraum--towels',
    nameDe: 'Benutzte Handtücher zur Wäsche bringen, frische auslegen',
    nameEn: 'Take dirty towels to laundry, lay out fresh',
    recurrence: rec.fixed(1),
  }),
  laserraum({
    id: 'laserraum--ring-light',
    nameDe: 'Ringlicht / Lupenlampe abwischen, Griff desinfizieren',
    nameEn: 'Wipe ring light / magnifying lamp, disinfect handle',
    recurrence: rec.fixed(30),
  }),
  laserraum({
    id: 'laserraum--dust-tv',
    nameDe: 'TV, TV-Tisch und Schrankoberseite abstauben, Schrankgriffe abwischen',
    nameEn: 'Dust TV, TV table, cupboard top; wipe cupboard handles',
    recurrence: rec.fixed(30),
  }),
  laserraum({
    id: 'laserraum--mini-fridge-exterior',
    nameDe: 'Minikühlschrank außen abwischen',
    nameEn: 'Wipe mini fridge exterior',
    recurrence: rec.fixed(30),
  }),
  laserraum({
    id: 'laserraum--clean-tv-windows',
    nameDe: 'TV-Bildschirm und Fenster reinigen',
    nameEn: 'Clean TV screen and windows',
    recurrence: rec.fixed(90),
  }),
  laserraum({
    id: 'laserraum--fridge-expiry',
    nameDe: 'Haltbarkeit der Produkte im Minikühlschrank prüfen',
    nameEn: 'Check product expiry inside the mini fridge',
    recurrence: rec.fixed(90),
  }),

  // --- Elektrolyseraum ----------------------------------------------------
  elektrolyseraum({
    id: 'elektrolyseraum--paper-cover',
    nameDe: 'Papierauflage des Behandlungsstuhls wechseln',
    nameEn: 'Change paper cover of the armchair',
    recurrence: rec.event('client'),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--disinfect-device',
    nameDe: 'Gerät und Sondenhalter desinfizieren, Nadel- und Sondenvorrat prüfen',
    nameEn: 'Disinfect device, probe holder; check needle / probe stock',
    recurrence: rec.event('client'),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--sterilizer',
    nameDe: 'Sterilisator laufen lassen und prüfen, Pinzetten und Instrumente kontrollieren, dokumentieren',
    nameEn: 'Run and verify sterilizer, check forceps and tools, log it',
    recurrence: rec.fixed(1),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--restock-cart',
    nameDe: 'Wagen auffüllen: sterile Sonden, Watte, Handschuhe, Nachsorge (Aloe, Bepanthen), Desinfektion',
    nameEn: 'Restock cart: sterile probes, cotton, gloves, aftercare (Aloe, Bepanthen), disinfectant',
    recurrence: rec.fixed(1),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--bin-surfaces',
    nameDe: 'Mülleimer leeren und desinfizieren, Hocker, Stuhl und Wagen abwischen',
    nameEn: 'Empty and disinfect bin; wipe hocker, chair, cart',
    recurrence: rec.fixed(1),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--mop-floor',
    nameDe: 'Laminatboden wischen',
    nameEn: 'Mop laminate floor',
    recurrence: rec.fixed(7),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--dust-cupboard',
    nameDe: 'Schrank und Fensterbänke abstauben',
    nameEn: 'Dust cupboard and sills',
    recurrence: rec.fixed(7),
  }),
  elektrolyseraum({
    id: 'elektrolyseraum--clean-windows',
    nameDe: 'Fenster reinigen',
    nameEn: 'Clean windows',
    recurrence: rec.fixed(90),
  }),

  // --- Massageraum (massage) — freelancers Anna (Mo, Mi), Nika (Do) -------
  massageraum({
    id: 'massageraum--disinfect-liege',
    nameDe: 'Massageliege desinfizieren, frische Laken auflegen',
    nameEn: 'Disinfect massage couch, put on fresh sheets',
    recurrence: rec.event('use'),
  }),
  massageraum({
    id: 'massageraum--restock-before',
    nameDe: 'Vor der Schicht auffüllen: Handtücher, Liegenpapier, Öl, Tücher, Desinfektion',
    nameEn: 'Restock towels, couch roll, oil, tissues, disinfectant before the shift',
    recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'before' }),
  }),
  massageraum({
    id: 'massageraum--launder-after',
    nameDe: 'Handtücher und Laken nach jeder Schicht waschen',
    nameEn: 'Launder towels and sheets after each shift',
    recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'after' }),
  }),
  massageraum({
    id: 'massageraum--air-room',
    nameDe: 'Vor der Schicht lüften, Licht und Duft einstellen',
    nameEn: 'Air the room, set light and scent before the shift',
    recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'before' }),
  }),
  massageraum({
    id: 'massageraum--empty-bin-mop',
    nameDe: 'Mülleimer leeren, Boden wischen',
    nameEn: 'Empty bin, mop floor',
    recurrence: rec.weekdays({ useDayGroup: 'all' }),
  }),
  massageraum({
    id: 'massageraum--mop-oil',
    nameDe: 'Boden wischen (Ölflecken entfernen)',
    nameEn: 'Mop the floor (cleaning oil stains)',
    recurrence: rec.weekdays({ useDayGroup: 'all', phase: 'after' }),
  }),
  massageraum({
    id: 'massageraum--dust-surfaces',
    nameDe: 'Oberflächen und Regale abstauben',
    nameEn: 'Dust surfaces and shelves',
    recurrence: rec.fixed(7),
  }),

  // --- Küche --------------------------------------------------------------
  kueche({
    id: 'kueche--dishwasher',
    nameDe: 'Spülmaschine einräumen, laufen lassen und ausräumen, Arbeitsflächen und Spüle abwischen',
    nameEn: 'Load, run and empty dishwasher; wipe counters and sink',
    recurrence: rec.fixed(1),
  }),
  kueche({
    id: 'kueche--rubbish',
    nameDe: 'Müll rausbringen und trennen',
    nameEn: 'Take out rubbish and recycling (Mülltrennung)',
    recurrence: rec.fixed(1),
    primaryOwner: 'mojo',
  }),
  kueche({
    id: 'kueche--fruit-basket',
    nameDe: 'Obstkorb auffüllen, überreifes Obst entfernen',
    nameEn: 'Refill fruit basket, remove overripe fruit',
    recurrence: rec.fixed(3),
    primaryOwner: 'mojo',
  }),
  kueche({
    id: 'kueche--dish-cloths',
    nameDe: 'Geschirrtücher waschen',
    nameEn: 'Wash dish cloths',
    recurrence: rec.fixed(3),
    primaryOwner: 'mojo',
    notesDe: 'Schwamm alle 7 Tage austauschen.',
    notesEn: 'Replace the sponge every 7 days.',
  }),
  kueche({
    id: 'kueche--microwave',
    nameDe: 'Mikrowelle innen reinigen',
    nameEn: 'Clean microwave interior',
    recurrence: rec.fixed(90),
  }),
  kueche({
    id: 'kueche--restock-supplies',
    nameDe: 'Küchenpapier, Tee, Kaffee, Zucker, SodaStream-Flaschen / CO2 auffüllen',
    nameEn: 'Restock paper towels, tea, coffee, sugar, SodaStream bottles / CO2',
    recurrence: rec.fixed(7),
    primaryOwner: 'mojo',
  }),
  kueche({
    id: 'kueche--wipe-fridge',
    nameDe: 'Kühlschrank samt Regal abwischen',
    nameEn: 'Wipe fridge and its shelf',
    recurrence: rec.fixed(7),
  }),
  kueche({
    id: 'kueche--descale-tap',
    nameDe: 'Wasserhahn und Spüle entkalken (Kalk wird sichtbar)',
    nameEn: 'Descale the tap and sink (limescale is showing)',
    recurrence: rec.fixed(14),
  }),
  kueche({
    id: 'kueche--toaster-tray',
    nameDe: 'Krümelschublade des Toasters reinigen',
    nameEn: 'Clean toaster crumb tray',
    recurrence: rec.fixed(14),
    primaryOwner: 'mojo',
  }),
  kueche({
    id: 'kueche--descale-appliances',
    nameDe: 'Wasserkocher und SodaStream-Düse entkalken, Reinigungsprogramm der Spülmaschine laufen lassen',
    nameEn: 'Descale kettle and SodaStream nozzle, run dishwasher cleaning cycle',
    recurrence: rec.fixed(60),
  }),

  // --- WC & Waschraum -----------------------------------------------------
  wc({
    id: 'wc--toilets',
    nameDe: 'Toiletten, Urinal, Brillen und Spültasten reinigen und desinfizieren',
    nameEn: 'Clean and disinfect toilets, urinal, seats, flush buttons',
    recurrence: rec.fixed(3),
  }),
  wc({
    id: 'wc--inner-stains',
    nameDe: 'Mögliche Ablagerungen im Toilettenbecken entfernen',
    nameEn: 'Clean possible inner toilet stains',
    recurrence: rec.fixed(1),
  }),
  wc({
    id: 'wc--restock-paper',
    nameDe: 'Toilettenpapier und Papierhandtücher auffüllen',
    nameEn: 'Restock toilet paper and wall paper towels',
    recurrence: rec.fixed(14),
  }),
  wc({
    id: 'wc--refill-soap',
    nameDe: 'Handseife (Sagrotan + Kupferspender) und Handdesinfektion auffüllen',
    nameEn: 'Refill hand soap (Sagrotan + copper dispenser) and hand disinfectant',
    recurrence: rec.fixed(14),
  }),
  wc({
    id: 'wc--sinks-mirrors',
    nameDe: 'Waschbecken, Armaturen und Spiegel reinigen',
    nameEn: 'Clean sinks, taps, mirrors',
    recurrence: rec.fixed(7),
  }),
  wc({
    id: 'wc--empty-bins',
    nameDe: 'Mülleimer leeren',
    nameEn: 'Empty bins',
    recurrence: rec.fixed(1),
  }),
  wc({
    id: 'wc--mop-floor',
    nameDe: 'Boden wischen und desinfizieren',
    nameEn: 'Mop and disinfect floor',
    recurrence: rec.fixed(7),
  }),
  wc({
    id: 'wc--wipe-tiles',
    nameDe: 'Fliesen, Spritzbereiche und Türklinken abwischen',
    nameEn: 'Wipe tiles, splash areas, door handles',
    recurrence: rec.fixed(14),
  }),
  wc({
    id: 'wc--descale',
    nameDe: 'Armaturen und Waschbecken entkalken',
    nameEn: 'Descale taps and sinks',
    recurrence: rec.fixed(14),
  }),
  wc({
    id: 'wc--deep-clean-grout',
    nameDe: 'Fugen und den Bereich hinter der Toilette gründlich reinigen',
    nameEn: 'Deep clean grout and behind the toilet',
    recurrence: rec.fixed(30),
  }),

  // --- Pflanzen (winter Nov–Feb: roughly halve watering) -----------------
  pflanzen({
    id: 'pflanzen--dracaena-water',
    nameDe: 'Drachenbaum / Dracaena (×2): Gießen',
    nameEn: 'Dracaena (×2): Water',
    recurrence: rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] }),
    notesDe: 'Im Winter (Nov–Feb) reduziert gießen, alle 14 Tage.',
    notesEn: 'Reduced watering (every 14 days) in winter, Nov–Feb.',
  }),
  pflanzen({
    id: 'pflanzen--dracaena-dust',
    nameDe: 'Drachenbaum / Dracaena (×2): Blätter abstauben, braune Spitzen schneiden',
    nameEn: 'Dracaena (×2): Dust leaves, trim brown tips',
    recurrence: rec.fixed(14),
  }),
  pflanzen({
    id: 'pflanzen--strelitzie-water',
    nameDe: 'Strelitzie / Paradiesvogelblume: Gießen',
    nameEn: 'Strelitzia / bird of paradise: Water',
    recurrence: rec.seasonal(6, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 12 }] }),
    notesDe: 'Im Winter (Nov–Feb) etwa halb so oft gießen.',
    notesEn: 'Roughly halve watering in winter, Nov–Feb.',
  }),
  pflanzen({
    id: 'pflanzen--strelitzie-wipe',
    nameDe: 'Strelitzie / Paradiesvogelblume: Große Blätter abwischen, zum Licht drehen',
    nameEn: 'Strelitzia / bird of paradise: Wipe big leaves, rotate toward light',
    recurrence: rec.fixed(10),
  }),
  pflanzen({
    id: 'pflanzen--monstera-water',
    nameDe: 'Fensterblatt / Monstera: Gießen, wenn die oberen 3 cm trocken sind',
    nameEn: 'Monstera: Water when top 3 cm dry',
    recurrence: rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] }),
    notesDe: 'Gießen, wenn die oberen 3 cm trocken sind. Im Winter (Nov–Feb) etwa halb so oft.',
    notesEn: 'Water when the top 3 cm are dry; roughly halve in winter, Nov–Feb.',
  }),
  pflanzen({
    id: 'pflanzen--monstera-wipe',
    nameDe: 'Fensterblatt / Monstera: Blätter abwischen, Luftwurzeln ordnen',
    nameEn: 'Monstera: Wipe leaves, tidy aerial roots',
    recurrence: rec.fixed(14),
  }),
  pflanzen({
    id: 'pflanzen--philodendron-water',
    nameDe: 'Hänge-Philodendron: Gießen',
    nameEn: 'Trailing philodendron: Water',
    recurrence: rec.seasonal(7, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 14 }] }),
    notesDe: 'Im Winter (Nov–Feb) etwa halb so oft gießen.',
    notesEn: 'Roughly halve watering in winter, Nov–Feb.',
  }),
  pflanzen({
    id: 'pflanzen--philodendron-wipe',
    nameDe: 'Hänge-Philodendron: Blätter abwischen, lange Triebe kürzen',
    nameEn: 'Trailing philodendron: Wipe leaves, trim leggy vines',
    recurrence: rec.fixed(21),
  }),
  pflanzen({
    id: 'pflanzen--sansevieria-water',
    nameDe: 'Bogenhanf / Sansevieria (×2): Sparsam gießen',
    nameEn: 'Sansevieria (×2): Water sparingly',
    recurrence: rec.seasonal(18, { seasonalOverrides: [{ months: [11, 12, 1, 2], intervalDays: 36 }] }),
    notesDe: 'Staunässe lässt ihn faulen. Im Winter (Nov–Feb) etwa halb so oft.',
    notesEn: 'Overwatering rots it. Roughly halve in winter, Nov–Feb.',
  }),
  pflanzen({
    id: 'pflanzen--sansevieria-wipe',
    nameDe: 'Bogenhanf / Sansevieria (×2): Blätter abwischen',
    nameEn: 'Sansevieria (×2): Wipe leaves',
    recurrence: rec.fixed(21),
  }),
  pflanzen({
    id: 'pflanzen--remove-dead-leaves',
    nameDe: 'Alle Pflanzen: Tote und gelbe Blätter entfernen',
    nameEn: 'All plants: Remove dead / yellow leaves',
    recurrence: rec.fixed(7),
  }),
  pflanzen({
    id: 'pflanzen--pest-check',
    nameDe: 'Alle Pflanzen: Auf Schädlinge prüfen (Spinnmilben, Schildläuse)',
    nameEn: 'All plants: Check for pests (spider mites, scale)',
    recurrence: rec.fixed(30),
  }),
  pflanzen({
    id: 'pflanzen--fertilize',
    nameDe: 'Alle Pflanzen: Düngen',
    nameEn: 'All plants: Fertilize',
    recurrence: rec.seasonal(21, { activeMonths: [4, 5, 6, 7, 8, 9] }),
    notesDe: 'Nur von April bis September düngen.',
    notesEn: 'Fertilize only from April to September.',
  }),
  pflanzen({
    id: 'pflanzen--repot',
    nameDe: 'Alle Pflanzen: Umtopfen / obere Erdschicht erneuern',
    nameEn: 'All plants: Repot / refresh top soil',
    recurrence: rec.fixed(365),
  }),

  // --- Ganzer Salon -------------------------------------------------------
  salon({
    id: 'salon--door-handles',
    nameDe: 'Alle Türklinken, Schalter und Kontaktflächen desinfizieren',
    nameEn: 'Disinfect all door handles, switches, high touch points',
    recurrence: rec.fixed(30),
  }),
  salon({
    id: 'salon--ventilate',
    nameDe: 'Alle Räume lüften',
    nameEn: 'Ventilate all rooms',
    recurrence: rec.fixed(1),
    primaryOwner: 'mojo',
  }),
  salon({
    id: 'salon--laundry',
    nameDe: 'Wäsche: Handtücher, Haarbänder und Bezüge waschen, trocknen, falten',
    nameEn: 'Laundry: wash, dry, fold towels, headbands, covers',
    recurrence: rec.fixed(1),
    primaryOwner: 'mojo',
  }),
  salon({
    id: 'salon--charge-devices',
    nameDe: 'iPad, Terminal, Geräte und Lupenbrille laden',
    nameEn: 'Charge iPad, terminal, devices, magnifying visor',
    recurrence: rec.fixed(1),
    primaryOwner: 'mojo',
  }),
  salon({
    id: 'salon--interior-windows',
    nameDe: 'Innenfenster reinigen',
    nameEn: 'Clean interior windows',
    recurrence: rec.fixed(60),
  }),
  salon({
    id: 'salon--check-bulbs',
    nameDe: 'Defekte Leuchtmittel und den LED-Streifen am Tresen prüfen / austauschen',
    nameEn: 'Check / replace dead bulbs and the lit counter LED strip',
    recurrence: rec.fixed(14),
    primaryOwner: 'mojo',
  }),
  salon({
    id: 'salon--first-aid',
    nameDe: 'Erste-Hilfe-Kasten und Feuerlöscher prüfen',
    nameEn: 'First aid kit and fire extinguisher check',
    recurrence: rec.fixed(90),
  }),

  // --- Wertschöpfende Aufgaben (Nicole's gap-filler jobs) -----------------
  mehrwert({
    id: 'mehrwert--prep-rooms',
    nameDe: 'Räume für morgen vorbereiten: Werkzeuge auslegen, Wagen auffüllen, Kundenakten und Einwilligungen bereitlegen, Hauttyp und Allergien notieren',
    nameEn: "Prep tomorrow's rooms: lay out tools, restock trolleys, pull client files and consent forms, note skin type and allergies",
    recurrence: rec.fixed(1),
    primaryOwner: 'nicolita',
  }),
  mehrwert({
    id: 'mehrwert--aftercare',
    nameDe: 'Nachsorge-Nachrichten an neue Kundschaft senden (nach dem ersten Termin)',
    nameEn: 'Send aftercare follow up messages to recent clients (for first-timer clients)',
    recurrence: rec.fixed(1),
    primaryOwner: 'nicolita',
    notesDe: 'Im Ton von FareWell.',
    notesEn: "In FareWell's voice.",
  }),
  mehrwert({
    id: 'mehrwert--review-request',
    nameDe: 'Zufriedene Kundschaft um eine Google-Bewertung bitten oder eine Bewertungskarte mitgeben',
    nameEn: 'Ask happy clients for a Google review or hand them a review card',
    recurrence: rec.event('treatment'),
    primaryOwner: 'nicolita',
  }),
  mehrwert({
    id: 'mehrwert--photos',
    nameDe: 'Saubere Vorher- / Nachher-Fotos und kurze Clips (mit Einwilligung) für Instagram aufnehmen',
    nameEn: 'Capture clean before / after photos and short clips (with consent) for Instagram',
    recurrence: rec.adHoc(),
    primaryOwner: 'nicolita',
    notesDe: 'In ruhigen Momenten.',
    notesEn: 'When quiet.',
  }),
  mehrwert({
    id: 'mehrwert--deep-clean-rotation',
    nameDe: 'Deep-Clean-Rotation: Jede Woche bekommt eine Zone die Gründlichkeitskur',
    nameEn: 'Deep clean rotation: one zone gets the thorough treatment each week',
    recurrence: rec.rotating(7, DEEP_CLEAN_ZONES),
    primaryOwner: 'nicolita',
  }),
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
