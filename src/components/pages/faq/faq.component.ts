import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/faq';
const PAGE_TITLE_DE = 'FAQ: Häufige Fragen zu Haarentfernung & Behandlungen | FareWell Nürnberg';
const PAGE_TITLE_EN = 'FAQ: Hair Removal & Treatments in Nuremberg | FareWell';
const PAGE_DESCRIPTION_DE =
  'Antworten auf die häufigsten Fragen an FareWell Nürnberg: Elektrolyse vs. Diodenlaser, Vorbereitung & Nachsorge, Termine & Preise, Kostenübernahme durch die Krankenkasse, Steuer und US-Forces-Mehrwertsteuerbefreiung.';
const PAGE_DESCRIPTION_EN =
  'Answers to the most common questions at FareWell Nuremberg: electrolysis vs. diode laser, how to prepare and aftercare, appointments and prices, insurance coverage, tax, and US Forces VAT exemption.';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
}

@Component({
  standalone: true,
  selector: 'app-faq',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'faq-schema';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  /** Interner Link in der aktiven Sprache (auf /en/-Seiten das englische Gegenstück). */
  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      { value: '2', label: this.t('Methoden der Haarentfernung', 'Hair removal methods') },
      { value: this.t('gratis', 'free'), label: this.t('Erstberatung', 'Initial consultation') },
      { value: '6', label: this.t('Tage pro Woche geöffnet', 'Days open per week') },
      { value: '6', label: this.t('Ratgeber zum Nachlesen', 'Guides to read') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'behandlungen', label: this.t('Behandlungen & Methoden', 'Treatments & methods') },
      {
        id: 'vorbereitung',
        label: this.t('Vorbereitung & Nachsorge', 'Preparation & aftercare'),
      },
      { id: 'koerper-massage', label: this.t('Körper & Massage', 'Body & massage') },
      {
        id: 'termine',
        label: this.t('Termine, Beratung & Preise', 'Appointments, consultation & prices'),
      },
      { id: 'kostenuebernahme', label: this.t('Krankenkasse & Steuer', 'Health insurance & tax') },
      { id: 'us-forces', label: this.t('US Forces & Mehrwertsteuer', 'US Forces & VAT') },
      { id: 'kontakt', label: this.t('Kontakt & Öffnungszeiten', 'Contact & opening hours') },
      { id: 'ratgeber', label: this.t('Ratgeber zum Vertiefen', 'Guides to go deeper') },
    ];
  }

  /**
   * Fragen und Antworten als Klartext für das FAQPage-Schema, in der Sprache
   * der aktiven Route. Inhaltlich deckungsgleich mit dem sichtbaren Akkordeon
   * im Template halten!
   */
  private get faqEntries(): FaqJsonLdEntry[] {
    return [
      {
        question: this.t(
          'Was ist der Unterschied zwischen permanenter und dauerhafter Haarentfernung?',
          'What is the difference between permanent and long-lasting hair removal?'
        ),
        answer: this.t(
          'Permanent ist in Deutschland allein die Elektrolyse (Nadelepilation): Jede Haarwurzel wird einzeln und endgültig verödet: die einzige rechtlich als permanent anerkannte Methode. Der Diodenlaser erreicht eine dauerhafte Haarentfernung, also eine deutliche, langanhaltende Reduktion, ideal für größere Zonen. Bei FareWell bekommst du beide Methoden und eine ehrliche Empfehlung, was für dich passt.',
          'In Germany, only electrolysis (Nadelepilation) is permanent: each hair root is deactivated individually and for good, the only method legally recognised as permanent. The diode laser achieves long-lasting hair removal, meaning a significant, enduring reduction, ideal for larger areas. At FareWell you get both methods and an honest recommendation on what suits you.'
        ),
      },
      {
        question: this.t(
          'Welche Behandlungen bietet FareWell an?',
          'Which treatments does FareWell offer?'
        ),
        answer: this.t(
          'Elektrolyse (Nadelepilation) zur permanenten Haarentfernung, Diodenlaser (4 Wellen) zur dauerhaften Haarentfernung, Microneedling mit Radiofrequenz zur Hautverjüngung, Kavitation zur Körperformung sowie Wellness- und therapeutische Massagen.',
          'Electrolysis (Nadelepilation), permanent hair removal. Diode laser (4 wavelengths), long-lasting hair removal. Microneedling with radio frequency, skin rejuvenation. Cavitation, body contouring. Wellness and therapeutic massages.'
        ),
      },
      {
        question: this.t(
          'Welche Methode der Haarentfernung passt zu mir?',
          'Which hair removal method is right for me?'
        ),
        answer: this.t(
          'Als Faustregel: Helle, feine, rötliche oder vereinzelte Haare und kleine Zonen wie das Gesicht sprechen für die Elektrolyse. Dunklere Haare auf größeren Flächen wie Beinen, Rücken oder Achseln sprechen für den Diodenlaser. In der kostenlosen Erstberatung schauen wir uns Haut und Haare gemeinsam an und empfehlen dir die passende Methode.',
          'As a rule of thumb: light, fine, reddish or isolated hairs and small areas like the face point to electrolysis. Darker hairs on larger areas like the legs, back or underarms point to the diode laser. In the free initial consultation we look at your skin and hair together and recommend the method that suits you.'
        ),
      },
      {
        question: this.t('Bietet FareWell auch IPL an?', 'Does FareWell offer IPL too?'),
        answer: this.t(
          'Nein, und das aus gutem Grund. Statt IPL setzen wir auf den 4-Wellen-Diodenlaser: Er erreicht eine dauerhafte Haarentfernung und arbeitet zuverlässiger bei mehr Haut- und Haartypen als klassische IPL-Geräte. Für die permanente Haarentfernung bieten wir zusätzlich die Elektrolyse an. Welche Methode zu dir passt, klären wir in der kostenlosen Erstberatung.',
          'No, and for good reason. Instead of IPL we rely on the four-wavelength diode laser: it achieves long-lasting hair removal and works more reliably across more skin and hair types than classic IPL devices. For permanent hair removal we also offer electrolysis. Which method suits you is something we sort out in the free initial consultation.'
        ),
      },
      {
        question: this.t('Wie viele Sitzungen brauche ich?', 'How many sessions do I need?'),
        answer: this.t(
          'Haare wachsen in Zyklen, und nur Haare in der Wachstumsphase lassen sich wirksam behandeln. Deshalb sind immer mehrere Sitzungen nötig. Wie viele genau, hängt von Körperzone, Haardichte und Hormonlage ab. Eine realistische Einschätzung bekommst du in der kostenlosen Erstberatung.',
          'Hair grows in cycles, and only hairs in the growth phase can be treated effectively, so several sessions are always needed. Exactly how many depends on the body area, hair density and hormonal situation. You will get a realistic estimate in the free initial consultation.'
        ),
      },
      {
        question: this.t(
          'Wie finde ich den richtigen Anbieter für Radiofrequenz-Microneedling in Nürnberg?',
          'How do I find the right provider for radio-frequency microneedling in Nuremberg?'
        ),
        answer: this.t(
          'Achte auf drei Dinge: geschultes Personal, ein zertifiziertes Gerät und eine ehrliche Beratung, die dir sagt, was realistisch ist. Bei FareWell arbeiten Nicole und Joé mit einem Gerät, das feine Nadeln mit Radiofrequenz verbindet, und wir besprechen vor jeder Behandlung Ablauf, Sitzungen und Kosten.',
          'Look for three things: trained staff, a certified device and honest advice that tells you what is realistic. At FareWell, Nicole and Joé work with a device that combines fine needles with radio frequency, and before every treatment we talk through the process, the sessions and the costs.'
        ),
      },
      {
        question: this.t(
          'Wie werde ich Gesichtsbehaarung dauerhaft los?',
          'How can I get rid of facial hair permanently?'
        ),
        answer: this.t(
          'In Deutschland ist die einzige rechtlich als permanent anerkannte Methode die Elektrolyse (Nadelepilation): Jede Haarwurzel wird einzeln und endgültig behandelt. Sie funktioniert bei jeder Haut- und Haarfarbe, auch bei feinen, hellen oder grauen Gesichtshaaren, die ein Laser nicht erfassen kann. Bei FareWell in Nürnberg bekommst du eine kostenlose Erstberatung und eine ehrliche Empfehlung. Am einfachsten buchst du über unser Online-Buchungssystem (salonkee.de/salon/farewell).',
          'In Germany, the only method legally recognised as permanent is electrolysis (Nadelepilation): each hair root is treated individually and for good. It works on every skin and hair colour, including fine, light or grey facial hair that a laser cannot target. At FareWell in Nürnberg you get a free consultation in English and an honest recommendation. You can book easily through our online booking system (salonkee.de/salon/farewell).'
        ),
      },
      {
        question: this.t(
          'Wie buche ich einen Termin bei FareWell?',
          'How do I book an appointment at FareWell?'
        ),
        answer: this.t(
          'Am einfachsten online über Salonkee (salonkee.de/salon/farewell), rund um die Uhr, mit sofortiger Bestätigung. Alternativ erreichst du uns per Instagram-Nachricht (@farewell.salon) oder telefonisch unter +49 157 5799 5694.',
          'The easiest way is online via Salonkee (salonkee.de/salon/farewell), around the clock and with instant confirmation. You can also reach us by message on Instagram (@farewell.salon) or by phone at +49 157 5799 5694.'
        ),
      },
      {
        question: this.t(
          'Wo kann ich Radiofrequenz-Microneedling in Nürnberg buchen?',
          'Where can I book radio-frequency microneedling in Nuremberg?'
        ),
        answer: this.t(
          'Direkt bei FareWell im Zentrum von Nürnberg, Frauentorgraben 5, wenige Gehminuten vom Hauptbahnhof. Radiofrequenz-Microneedling führen Nicole und Joé durch. Am einfachsten buchst du online über Salonkee (salonkee.de/salon/farewell), rund um die Uhr und mit sofortiger Bestätigung. Die Erstberatung ist kostenlos und unverbindlich.',
          'Right at FareWell in the centre of Nuremberg, Frauentorgraben 5, a few minutes\' walk from the main station. Radio-frequency microneedling is carried out by Nicole and Joé. The easiest way to book is online via Salonkee, around the clock and with instant confirmation. The initial consultation is free and without obligation.'
        ),
      },
      {
        question: this.t('Was kostet eine Behandlung?', 'How much does a treatment cost?'),
        answer: this.t(
          'Alle Preise stehen transparent je Körperzone auf unserer Preisseite unter farewell.salon/price. Die Erstberatung ist kostenlos, und für den Kassenantrag erstellen wir dir einen schriftlichen Kostenvoranschlag.',
          'All prices are listed transparently by body area on our price page. The initial consultation is free, and for your insurance application we prepare a written cost estimate.'
        ),
      },
      {
        question: this.t(
          'Was kostet Laser-Haarentfernung in Nürnberg?',
          'How much does laser hair removal cost in Nuremberg?'
        ),
        answer: this.t(
          'Die Preise richten sich nach der Körperzone und stehen alle auf unserer Preisseite unter farewell.salon/price. Eine Achsel ist zum Beispiel günstiger als Beine oder Rücken. Angehörige der US-Streitkräfte erhalten mit dem Promo-Code USLASER 20% lebenslang. Die kostenlose Erstberatung gibt dir eine realistische Einschätzung deiner Sitzungen und Kosten.',
          'Prices depend on the body area and are all listed on our price page. An underarm, for example, costs less than the legs or the back. US Forces members get 20% off for life with the promo code USLASER. The free initial consultation gives you a realistic estimate of your sessions and costs.'
        ),
      },
      {
        question: this.t(
          'Was kostet Radiofrequenz-Microneedling in Nürnberg?',
          'How much does radio-frequency microneedling cost in Nuremberg?'
        ),
        answer: this.t(
          'Alle Preise stehen transparent je Behandlung auf unserer Preisseite unter farewell.salon/price. In der kostenlosen Erstberatung schauen wir uns dein Hautbild an und sagen dir ehrlich, wie viele Sitzungen sinnvoll sind und was sie kosten, ohne Verpflichtung.',
          'All prices are listed transparently by treatment on our price page. In the free initial consultation we look at your skin and tell you honestly how many sessions make sense and what they cost, with no obligation.'
        ),
      },
      {
        question: this.t(
          'Ist die Erstberatung wirklich kostenlos?',
          'Is the initial consultation really free?'
        ),
        answer: this.t(
          'Ja. Wir schauen uns deine Haut- und Haarsituation an, besprechen Methode, Ablauf, Sitzungsanzahl und Kosten, ohne Berechnung und ohne Verpflichtung.',
          'Yes. We look at your skin and hair, discuss the method, the process, the number of sessions and the costs, with no charge and no obligation.'
        ),
      },
      {
        question: this.t(
          'Übernimmt die Krankenkasse die Epilation bei der Transition?',
          'Does health insurance cover epilation for gender confirmation?'
        ),
        answer: this.t(
          'Ja, das ist möglich. Die Kasse übernimmt Epilation als Sachleistung, wenn sie medizinisch notwendig ist (§ 27 SGB V), etwa bei der Diagnose Geschlechtsinkongruenz (ICD F64.0). Der Knackpunkt ist der Ärztevorbehalt (§ 28 SGB V): Die Behandlung muss als ärztliche Leistung gelten. Weil FareWell mit einer delegierenden Ärztin arbeitet, ist genau das gelöst. Wichtig: Der Antrag muss vor Behandlungsbeginn gestellt werden. Alle Schritte erklärt unser Leitfaden „Epilation über die Krankenkasse“.',
          'Yes, that is possible. Your health insurer covers epilation as a benefit in kind when it is medically necessary (§ 27 SGB V), for example with a diagnosis of gender incongruence (ICD F64.0). The key point is the doctor\'s reservation (§ 28 SGB V): the treatment must count as a medical service. Because FareWell works with a delegating doctor, exactly this is taken care of. Important: the application must be submitted before treatment begins. Every step, deadline and appeal is explained in our guide on insurance-covered epilation (in German).'
        ),
      },
      {
        question: this.t(
          'Was bedeutet „ärztliche Delegation“ bei FareWell?',
          'What does “medical delegation” mean at FareWell?'
        ),
        answer: this.t(
          'Eine Ärztin delegiert die Epilationsbehandlung an unser geschultes Team und bleibt medizinisch verantwortlich. Dadurch zählt die Nadelepilation bei FareWell als ärztlich delegierte Leistung: die Voraussetzung dafür, dass die Krankenkasse sie als Sachleistung übernehmen kann. Für deinen Antrag erstellen wir gemeinsam den Kostenvoranschlag.',
          'A doctor delegates the epilation treatment to our trained team and remains medically responsible. This makes electrolysis at FareWell a medically delegated service, the condition for your health insurer to cover it as a benefit in kind. For your application we prepare the cost estimate together.'
        ),
      },
      {
        question: this.t(
          'Kann ich die Behandlungskosten von der Steuer absetzen?',
          'Can I deduct treatment costs from my taxes?'
        ),
        answer: this.t(
          'Ja. Den Anteil, den du selbst trägst, kannst du als außergewöhnliche Belastung in der Steuererklärung geltend machen, wenn die medizinische Notwendigkeit dokumentiert ist (z. B. bei Behandlungen im Zuge der Transition). Elektrolyse und Diodenlaser werden steuerlich gleich behandelt. Du brauchst drei Bausteine: den medizinischen Nachweis, ordentliche Rechnungen von FareWell und Zahlungsbelege. Details stehen in unserem Steuer-Leitfaden.',
          'Yes. The share you pay yourself can be claimed as an extraordinary burden on your tax return when the medical necessity is documented (for example for treatments as part of gender confirmation). Electrolysis and the diode laser are treated the same way for tax purposes. You need three building blocks: the medical evidence, proper invoices from FareWell and proof of payment. The details are in our tax guide (in German).'
        ),
      },
      {
        question: this.t(
          'Was brauche ich von meiner Ärztin, bevor ich starte?',
          'What do I need from my doctor before I start?'
        ),
        answer: this.t(
          'Die Diagnose (Geschlechtsdysphorie bzw. Geschlechtsinkongruenz, ICD F64.0) und eine Bescheinigung, dass die Haarentfernung zur Transition medizinisch notwendig ist, idealerweise ausgestellt vor der ersten Sitzung. Für den Kassenantrag kommt der ärztliche Bericht dazu.',
          'The diagnosis (gender dysphoria or gender incongruence, ICD F64.0) and a certificate confirming that the hair removal is medically necessary for gender confirmation, ideally issued before the first session. For the insurance application, the medical report is added.'
        ),
      },
      {
        question: this.t(
          'Ich gehöre zu den US-Streitkräften: Kann ich ohne Mehrwertsteuer zahlen?',
          'I am a member of the US Forces, can I pay without VAT?'
        ),
        answer: this.t(
          'Ja. Dank des NATO-Truppenstatuts (SOFA) stellen wir dir mit einem NF1-Formular die Behandlung ohne die deutsche Mehrwertsteuer von 19% aus. Das Formular musst du vor der Zahlung vorlegen. Alternativ zahlst du voll und holst dir die Mehrwertsteuer über die Remonon-App zurück. Beide Wege erklärt unser Leitfaden zur Mehrwertsteuerbefreiung, auf Deutsch und Englisch.',
          'Yes. Thanks to the NATO Status of Forces Agreement (SOFA), with an NF1 form we bill your treatment without the 19% German VAT. You must present the form before payment. Alternatively, you pay in full and reclaim the VAT through the Remonon app. Both routes are explained in our guide to VAT exemption, also available in English.'
        ),
      },
      {
        question: this.t(
          'Bietet ihr für Angehörige der US-Streitkräfte mehrwertsteuerfreie Behandlungen an?',
          'Do you offer VAT-free treatments for US Forces members?'
        ),
        answer: this.t(
          'Ja. Dank des NATO-Truppenstatuts (SOFA) legst du vor der Zahlung dein NF1-Formular vor und wir stellen dir die Behandlung ohne die deutsche Mehrwertsteuer von 19% aus. Alternativ zahlst du voll und holst dir die Mehrwertsteuer über die Remonon-App zurück. Zusätzlich erhalten Angehörige der US-Streitkräfte mit dem Promo-Code USLASER 20% lebenslang auf Laser-Haarentfernung. Alle Schritte erklärt unser englischer Leitfaden „US Forces VAT relief in Germany“.',
          'Yes. Under the Status of Forces Agreement, present your NF1 form before you pay and we bill you without the 19% German VAT. You can also pay in full and reclaim the VAT through the Remonon app. On top of that, US Forces members get 20% off laser hair removal for life with the promo code USLASER. Read our English guide “US Forces VAT relief in Germany” for the full walkthrough.'
        ),
      },
      {
        question: this.t(
          'Gibt es einen Rabatt für US-Streitkräfte?',
          'Is there a discount for US Forces?'
        ),
        answer: this.t(
          'Ja: 20% lebenslang auf Laser-Haarentfernung mit dem Promo-Code USLASER, zusätzlich kombinierbar mit der Mehrwertsteuerbefreiung. Eine Laserbehandlung von 150 € kostet so rund 100 €, etwa ein Drittel weniger.',
          'Yes: 20% for life on laser hair removal with the promo code USLASER, and it combines with the VAT exemption on top. A laser treatment of €150 then costs around €100, roughly a third less.'
        ),
      },
      {
        question: this.t('Wo finde ich FareWell?', 'Where can I find FareWell?'),
        answer: this.t(
          'Im Zentrum von Nürnberg: Frauentorgraben 5, 90443 Nürnberg, wenige Gehminuten vom Hauptbahnhof und Opernhaus entfernt.',
          'In the centre of Nuremberg: Frauentorgraben 5, 90443 Nürnberg, a few minutes\' walk from the main station and the opera house.'
        ),
      },
      {
        question: this.t(
          'Welche Öffnungszeiten hat FareWell?',
          'What are the opening hours at FareWell?'
        ),
        answer: this.t(
          'Montag bis Freitag 10–20 Uhr, Samstag 8–17 Uhr. Termine vereinbarst du am besten online über Salonkee.',
          'Monday to Friday 10 am to 8 pm, Saturday 8 am to 5 pm. The best way to make an appointment is online via Salonkee.'
        ),
      },
      {
        question: this.t(
          'Wie bereite ich mich auf meine Laser-Haarentfernung vor?',
          'How do I prepare for laser hair removal?'
        ),
        answer: this.t(
          'Rasiere das Areal am besten etwa zwei Tage vor dem Termin, denn die Haarwurzel muss in der Haut bleiben, also bitte nicht zupfen oder wachsen. Mindestens sechs Wochen vorher solltest du nicht epilieren, und Sonne oder Solarium meidest du vor und nach der Behandlung; je heller die Haut, desto besser wirkt der Laser. Am Behandlungstag kommst du ohne Deo, Creme oder Parfum im Bereich. Alle Details stehen im Abschnitt „Vorbereitung & Nachsorge“ auf der Diodenlaser-Seite.',
          'Shave the area ideally about two days before, because the hair root has to stay in the skin, so please don\'t pluck or wax. Don\'t epilate for at least six weeks beforehand, and avoid sun or tanning beds before and after; the lighter the skin, the better the laser works. On the day, come without deodorant, cream or perfume on the area. Every detail is in the preparation & aftercare section of the diode laser page.'
        ),
      },
      {
        question: this.t(
          'Nach der Laserbehandlung fallen Haare aus und es wirken kurz mehr, ist das normal?',
          'After laser, hairs shed and there briefly seem to be more, is that normal?'
        ),
        answer: this.t(
          'Ja. In den ersten rund zwei Wochen nach einer Sitzung stoßen die behandelten Haare ab, das sieht aus wie Nachwachsen, tatsächlich fallen sie aus. Und nach der dritten bis vierten Sitzung können kurzzeitig mehr Haare sichtbar sein, weil ruhende Follikel aktiviert werden und erst dann mitbehandelt werden können. Beides gehört zum normalen Verlauf.',
          'Yes. Over the first couple of weeks after a session the treated hairs shed, which looks like regrowth but is actually them falling out. And after the third to fourth session you may briefly see more hairs, because dormant follicles get activated and can only then be treated too. Both are part of the normal process.'
        ),
      },
      {
        question: this.t(
          'Wie bereite ich mich auf die Nadelepilation vor?',
          'How do I prepare for electrolysis (Nadelepilation)?'
        ),
        answer: this.t(
          'Lass die Haare auf etwa 2 bis 5 mm wachsen, damit sie gut erfasst werden können, also vier bis sechs Wochen vorher nicht zupfen, wachsen oder epilieren; Rasieren oder Schneiden zwischen den Terminen ist in Ordnung. Komm mit sauberer Haut ohne Make-up, Deo oder Öl und verzichte kurz vorher möglichst auf Kaffee, Energydrinks und Alkohol, weil sie die Haut empfindlicher machen. Die vollständige Checkliste findest du im Abschnitt „Vorbereitung & Nachsorge“ der Nadelepilation.',
          'Let the hair grow to about 2 to 5 mm so it can be grasped well, so don\'t pluck, wax or epilate for four to six weeks beforehand; shaving or trimming between appointments is fine. Come with clean skin, free of make-up, deodorant or oil, and ideally avoid coffee, energy drinks and alcohol just before, as they make the skin more sensitive. You will find the full checklist in the preparation & aftercare section for electrolysis.'
        ),
      },
      {
        question: this.t(
          'Kann ich mich mit Tattoos oder Permanent Make-up behandeln lassen?',
          'Can I be treated if I have tattoos or permanent make-up?'
        ),
        answer: this.t(
          'Beim Diodenlaser nicht: Über Tattoos, Permanent Make-up, Microblading oder Henna kann das Gerät Farbpartikel nicht von Haarpigment unterscheiden, es besteht Verbrennungsgefahr. Die Elektrolyse (Nadelepilation) arbeitet dagegen mit Strom statt Licht und lässt sich in der Regel auch auf tätowierter Haut oder in Bereichen mit Permanent Make-up einsetzen, sie ist hier die Methode der Wahl.',
          'Not with the diode laser: over tattoos, permanent make-up, microblading or henna the device cannot tell ink from hair pigment, so there is a risk of burns. Electrolysis (Nadelepilation), on the other hand, works with current instead of light and can usually be used even on tattooed skin or areas with permanent make-up, it is the method of choice here.'
        ),
      },
      {
        question: this.t(
          'Kann ich mich in der Schwangerschaft oder Stillzeit behandeln lassen?',
          'Can I be treated during pregnancy or breastfeeding?'
        ),
        answer: this.t(
          'In der Schwangerschaft führen wir weder Nadelepilation noch Laser oder Kavitation durch. In der Stillzeit kann die Haut empfindlicher reagieren, deshalb entscheiden wir individuell. Bitte informiere uns in beiden Fällen vorab, dann finden wir gemeinsam den sichersten Weg.',
          'During pregnancy we do not perform electrolysis, laser or cavitation. During breastfeeding the skin can react more sensitively, so we decide individually. Please tell us in advance in either case, and we will find the safest way together.'
        ),
      },
      {
        question: this.t(
          'Welche Pflege empfehlt ihr nach der Behandlung?',
          'What aftercare do you recommend?'
        ),
        answer: this.t(
          'Fass die behandelten Stellen möglichst wenig an, kühle bei Bedarf sanft und verzichte 24 bis 48 Stunden auf Sauna, Solarium, Schwimmbad und intensiven Sport. Für die Pflege empfehlen wir Aloe Vera Gel (99 %), Bepanthen Wund- und Heilsalbe sowie einen hohen Sonnenschutz für empfindliche Haut. Deine genaue Nachsorge-Routine besprechen wir mit dir beim Termin.',
          'Touch the treated areas as little as possible, cool them gently if needed, and avoid sauna, tanning beds, swimming pools and intense sport for 24 to 48 hours. For care we recommend Aloe Vera gel (99%), Bepanthen wound and healing ointment and a high sunscreen for sensitive skin. We will go through your exact aftercare routine with you at your appointment.'
        ),
      },
      {
        question: this.t(
          'Ich nehme Medikamente oder habe eine Hauterkrankung, kann ich behandelt werden?',
          'I take medication or have a skin condition, can I still be treated?'
        ),
        answer: this.t(
          'Sag uns das bitte vorab. Manche Medikamente (etwa Blutverdünner, Kortison, Aknemittel wie Isotretinoin oder Antibiotika) und Erkrankungen (z. B. Diabetes, Herpes, aktive Akne, Schuppenflechte oder Lichtempfindlichkeit) beeinflussen, ob und wie wir behandeln. Wir schätzen das individuell ein und bitten dich im Zweifel, es vorher ärztlich abklären zu lassen. Bei akuten Infekten, Fieber, frischem Sonnenbrand oder offenen Wunden verschieben wir den Termin.',
          'Please tell us in advance. Some medication (such as blood thinners, cortisone, acne medication like isotretinoin, or antibiotics) and conditions (e.g. diabetes, herpes, active acne, psoriasis or light sensitivity) affect whether and how we treat. We assess this individually and, if in doubt, ask you to clarify it with your doctor first. With acute infections, fever, fresh sunburn or open wounds we postpone the appointment.'
        ),
      },
      {
        question: this.t(
          'Wie bereite ich mich auf Microneedling vor?',
          'How do I prepare for microneedling?'
        ),
        answer: this.t(
          'Komm ungeschminkt und mit sauberer Haut; drei bis fünf Tage vorher bitte keine Peelings, kein Retinol, keine Fruchtsäuren und keinen Selbstbräuner. Zwischen Botox und RF-Microneedling sollten mindestens zwei Wochen liegen. Alle Punkte stehen im Abschnitt „Wichtige Hinweise“ auf der Microneedling-Seite.',
          'Come without make-up and with clean skin; for three to five days beforehand please avoid peels, retinol, fruit acids and self-tanner. Leave at least two weeks between Botox and RF microneedling. Every point is in the important notes on the microneedling page.'
        ),
      },
      {
        question: this.t(
          'Wie läuft eine Kavitation ab und wie oft sollte ich kommen?',
          'How does cavitation work and how often should I come?'
        ),
        answer: this.t(
          'Die Kavitation wirkt am besten als Kur: Weil sich das Gewebe schrittweise verändert, sind mehrere Sitzungen nötig. Zwischen zwei Terminen sollten etwa zwei bis vier Tage liegen, damit Lymphe und Stoffwechsel die gelösten Stoffe abtransportieren können. Trink schon vorher ausreichend Wasser, komm ohne Bodylotion oder Öl auf der Haut, und ein Spaziergang nach der Behandlung unterstützt den Abtransport zusätzlich.',
          'Cavitation works best as a course of treatments: because the tissue changes gradually, several sessions are needed. Leave about two to four days between appointments so your lymphatic system and metabolism can carry away what has been released. Drink plenty of water beforehand, come without body lotion or oil on the skin, and a walk after the treatment further supports the drainage.'
        ),
      },
      {
        question: this.t(
          'Für wen ist eine Kavitation nicht geeignet?',
          'Who is cavitation not suitable for?'
        ),
        answer: this.t(
          'Bitte nicht während der Schwangerschaft, bei Herzschrittmacher, schweren Herz-Kreislauf-Erkrankungen oder akuten Entzündungen. Auch bei akuten Infekten, Fieber, offenen Wunden oder frischen Narben im Bereich sowie bei schweren Leber- oder Nierenerkrankungen behandeln wir nicht. Bei einer Krebserkrankung oder in der Nachsorge nur nach ärztlicher Rücksprache. Am Behandlungstag bitte keinen Alkohol.',
          "Please not during pregnancy, with a pacemaker, severe cardiovascular conditions or acute inflammation. We also don't treat with acute infections, fever, open wounds or fresh scars in the area, or with severe liver or kidney disease. With a cancer diagnosis or during aftercare, only after consulting your doctor. Please avoid alcohol on the day of treatment."
        ),
      },
      {
        question: this.t(
          'Kavitation, Ultraschall-Fettreduktion, Cellulite-Behandlung: Was ist der Unterschied?',
          'Cavitation, ultrasound fat reduction, cellulite treatment: what is the difference?'
        ),
        answer: this.t(
          'Alle drei arbeiten mit Ultraschall am Körper, setzen aber unterschiedliche Schwerpunkte: Die Ultraschall-Fettreduktion zielt auf hartnäckige Fettdepots, die Cellulite-Behandlung auf ein glatteres Hautbild, und die Kavitation ist das Verfahren dahinter. Welche Kombination für dich sinnvoll ist, klären wir in der kostenlosen Erstberatung.',
          'All three use ultrasound on the body but with different emphases: ultrasound fat reduction targets stubborn fat deposits, the cellulite treatment a smoother skin appearance, and cavitation is the technique behind them. Which combination makes sense for you is something we clarify in the free initial consultation.'
        ),
      },
      {
        question: this.t(
          'Was soll ich zur Massage anziehen, und wie läuft sie ab?',
          'What should I wear to a massage, and how does it work?'
        ),
        answer: this.t(
          'Während der gesamten Massage bleibt die Unterwäsche an, und Intimbereiche bleiben jederzeit bedeckt. Trag am besten bequeme Kleidung, trink vorher ausreichend Wasser und komm möglichst ohne Bodylotion oder Öl, damit die Massageöle wirken können. Am Behandlungstag solltest du möglichst auf Alkohol verzichten.',
          'Throughout the whole massage your underwear stays on, and intimate areas remain covered at all times. Wear comfortable clothing, drink enough water beforehand and come without body lotion or oil if you can, so the massage oils can work. Try to avoid alcohol on the day of your appointment.'
        ),
      },
      {
        question: this.t(
          'Für wen ist eine Wellness-Massage nicht geeignet?',
          'Who is a wellness massage not suitable for?'
        ),
        answer: this.t(
          'Bei akuten Infekten, Fieber oder starker Erkältung bitte nicht. Bei schweren Herz-Kreislauf-Erkrankungen oder akuten Entzündungen nur nach ärztlicher Rücksprache. Bei frischen Verletzungen, offenen Wunden oder akuten Schmerzen im Bereich sowie nach frischen Operationen verzichten wir auf die Massage. In der Schwangerschaft passen wir die Behandlung individuell an, bitte informiere uns vorab.',
          "Please not with acute infections, fever or a heavy cold. With severe cardiovascular conditions or acute inflammation, only after consulting your doctor. With fresh injuries, open wounds or acute pain in the area, or after recent surgery, we don't massage. During pregnancy we adapt the treatment individually, so please tell us in advance."
        ),
      },
      {
        question: this.t(
          'Wellness- oder therapeutische Massage: Was passt zu mir?',
          'Wellness or therapeutic massage: which is right for me?'
        ),
        answer: this.t(
          'Die Wellness-Massage dient Entspannung, Regeneration und Wohlbefinden. Die therapeutische Massage arbeitet gezielt an Verspannungen und Beschwerden, mit einer kurzen Anamnese zu Beginn. Im Zweifel beraten wir dich vor Ort, welche Variante zu dir passt.',
          "The wellness massage is for relaxation, recovery and wellbeing. The therapeutic massage works specifically on tension and complaints, with a short assessment at the start. If in doubt, we'll advise you in person which option suits you."
        ),
      },
    ];
  }

  ngOnInit(): void {
    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const title = this.t(PAGE_TITLE_DE, PAGE_TITLE_EN);
    const description = this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN);

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          mainEntity: this.faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.answer,
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: isEn ? 'https://farewell.salon/en' : 'https://farewell.salon',
            },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: pageUrl },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
