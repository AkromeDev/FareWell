/**
 * Inhalt von Party4Friends: die Regeln für Freund:innen, die im Salon feiern
 * wollen, als Road zum Durchklicken (gleiche Mechanik wie die Freelancer Road).
 *
 * Quelle: die WhatsApp-Gruppe, in der die ersten zwei Feiern im Salon
 * organisiert wurden (August bis Oktober 2026), und Joés Wunsch vom
 * 15.11.2026. Die Beispiele im Kasten „Joés Erfahrung" sind wahr, aber ohne
 * Namen, Nummern oder sonst etwas, woran man eine Person erkennt. So soll es
 * bleiben: nie einen Namen ergänzen.
 *
 * Zweisprachig: jeder Text ist ein {de, en}-Paar. Kein Gedankenstrich als
 * Satztrenner (Hausregel, der Spec prüft das).
 */

import type { Phase, Profession, RoadDefinition } from '../karriere/freelancer-road/road.model';

export type PartyId = 'freunde' | 'halboffen';

/** Stand der Inhalte, im Kleingedruckten der Seite. */
export const PARTY_STAND = 'November 2026';

const HALBOFFEN: PartyId[] = ['halboffen'];

export const PARTY_KINDS: Profession<PartyId>[] = [
  {
    id: 'freunde',
    icon: '🥂',
    label: { de: 'Feier unter Freunden', en: 'Party among friends' },
    status: {
      de: 'Alle Gäste sind eingeladen, ihr kennt sie, und sie stehen in eurer Partygruppe. Dann reichen feste Einlasszeiten und eine Nummer an der Tür.',
      en: 'Every guest is invited, you know them, and they are in your party group. Then fixed arrival times and a phone number at the door are enough.',
    },
  },
  {
    id: 'halboffen',
    icon: '🎶',
    label: { de: 'Halb offenes Event', en: 'Semi-open event' },
    status: {
      de: 'Gäste bringen Leute mit, die ihr nicht kennt. Dann braucht es zusätzlich eine Gästeliste und jemanden, der unten den Einlass macht, die ganze Nacht.',
      en: 'Guests bring people you do not know. Then you also need a guest list and someone downstairs letting people in, all night long.',
    },
  },
];

export const PARTY_PHASES: Phase<PartyId>[] = [
  // ------------------------------------------------------------------ 1
  {
    id: 'erst-reden',
    index: '01',
    tag: { de: 'Bevor ihr plant', en: 'Before you plan' },
    title: { de: 'Erst reden, dann planen', en: 'Talk first, then plan' },
    lead: {
      de: 'Der Salon ist mein Arbeitsplatz und ich gebe ihn gern für eure Feier her. Das Einzige, worum ich wirklich bitte: Redet mit mir, bevor etwas feststeht, und redet so, dass alle gleichzeitig Bescheid wissen.',
      en: 'The salon is where I work, and I am happy to lend it for your party. The one thing I really ask: talk to me before anything is fixed, and talk so that everyone knows at the same time.',
    },
    steps: [
      {
        id: 'treffen',
        weight: 'pflicht',
        title: { de: 'Ein Treffen mit mir, bevor ihr einladet', en: 'One meeting with me before you invite anyone' },
        summary: {
          de: 'Alle, die organisieren, kommen einmal an einem Abend vorbei. Wir gehen die Regeln durch, und erst danach gibt es ein Datum und Einladungen.',
          en: 'Everyone organising comes by one evening. We go through the rules, and only after that is there a date and invitations.',
        },
        details: [
          {
            de: 'Am besten feiert ihr an einem Samstag: Am Freitagabend wird aufgebaut, am Sonntag aufgeräumt, und am Montag ist der Salon wieder offen.',
            en: 'Saturday is the best day for the party: setting up on Friday evening, tidying up on Sunday, and on Monday the salon is open again.',
          },
          {
            de: 'Alle Organisator:innen, nicht nur eine Person, die es dann weitererzählt.',
            en: 'All organisers, not just one person who then passes it on.',
          },
          {
            de: 'Bringt mit: Datum, ungefähre Zahl der Gäste, ob es eine Feier unter Freunden oder ein halb offenes Event wird, und was ihr mitbringen wollt (Anlage, Bar, Sofas).',
            en: 'Bring: the date, roughly how many guests, whether it is a party among friends or a semi-open event, and what you want to bring (sound system, bar, sofas).',
          },
          {
            de: 'Diese Seite ist die Liste, die wir dabei durchgehen. Lest sie vorher.',
            en: 'This page is the list we go through. Read it beforehand.',
          },
        ],
        joe: {
          de: 'Beim ersten Mal wollten zwei Gruppen gleichzeitig im Salon feiern. Ich habe beide gebeten, an einem Abend zusammen vorbeizukommen, und wir haben alles besprochen, bevor jemand eingeladen hat. Das hat sich gelohnt.',
          en: 'The first time, two groups wanted to party in the salon at the same time. I asked both to come by together one evening, and we went through everything before anyone was invited. It paid off.',
        },
      },
      {
        id: 'eine-gruppe',
        weight: 'pflicht',
        title: { de: 'Eine Gruppe mit mir, und alles läuft dort', en: 'One group with me, and everything happens there' },
        summary: {
          de: 'Für jede Feier gibt es eine Orga-Gruppe, in der ich bin. Entscheidungen fallen dort, nicht zu zweit am Telefon, damit alle gleichzeitig Bescheid wissen.',
          en: 'Every party gets an organising group that I am in. Decisions are made there, not between two people on the phone, so that everyone knows at the same time.',
        },
        details: [
          {
            de: 'Was ihr unter euch ausmacht, schreibt ihr danach in die Gruppe, kurz und vollständig.',
            en: 'Whatever you agree among yourselves, write it in the group afterwards, short and complete.',
          },
          {
            de: 'Wer neu dazukommt, wird in die Gruppe geholt und liest diese Seite.',
            en: 'Anyone who joins is added to the group and reads this page.',
          },
          {
            de: 'Die Gästegruppe ist eine andere Gruppe. In die Orga-Gruppe gehören nur die, die mitorganisieren.',
            en: 'The guest group is a different group. Only people who help organise belong in the organising group.',
          },
        ],
      },
      {
        id: 'mitorganisatoren',
        weight: 'pflicht',
        title: { de: 'Neue Mitorganisator:innen? Erst mich fragen', en: 'New co-organisers? Ask me first' },
        summary: {
          de: 'Wenn ihr mit anderen zusammenlegt, einen zweiten Anlass dazunehmt oder jemand mitorganisiert, fragt ihr mich, bevor ihr es nach außen sagt.',
          en: 'If you team up with others, add a second occasion or someone joins the organising, you ask me before telling anyone else.',
        },
        details: [
          {
            de: 'Meistens ist das kein Problem. Das Problem ist, es als Letzter zu erfahren.',
            en: 'Usually it is not a problem. The problem is finding out last.',
          },
          {
            de: 'Wer neu mitorganisiert, bekommt alle Regeln, auch die, die „nichts an der Party ändern".',
            en: 'Anyone new to the organising gets all the rules, including the ones that "do not change anything about the party".',
          },
        ],
        joe: {
          de: 'Einmal wurde aus einer Feier eine gemeinsame Feier mit weiteren Organisator:innen. Das wäre kein Problem gewesen. Erfahren habe ich es aber erst, als die Nachrichten an die Gäste schon herumgingen, und eine Hausregel war mit den Neuen nie besprochen worden. Die Antwort war: „Da sich an der Party nichts ändert, dachte ich, es ist für dich nicht wichtig." Doch, ist es. Genau das meine ich mit fehlender Kommunikation.',
          en: 'Once a party turned into a joint party with more organisers. That would have been fine. But I only found out when the messages to the guests were already going round, and one house rule had never been discussed with the new people. The answer was: "Since nothing changes about the party, I didn\'t think it mattered to you." It does. That is exactly what I mean by a lack of communication.',
        },
      },
      {
        id: 'einladung',
        weight: 'empfohlen',
        title: { de: 'Die Einladung: der Text, den wir abgesprochen haben', en: 'The invitation: the text we agreed on' },
        summary: {
          de: 'Was in der Einladung über den Salon und die Regeln steht, sprechen wir vorher ab. Schlage ich eine Version vor, geht diese Version raus.',
          en: 'What the invitation says about the salon and the rules, we agree beforehand. If I suggest a version, that version goes out.',
        },
        details: [
          {
            de: 'Rein gehören: Adresse, Uhrzeit, Einlasszeiten, Socken statt Schuhe, wen man anruft, wenn man später kommt.',
            en: 'It should contain: address, time, arrival times, socks instead of shoes, whom to call if you arrive later.',
          },
          {
            de: 'Socken- oder Hausschuhparty spätestens eine Woche vorher in der Gästegruppe ansagen.',
            en: 'Announce the socks or slippers party in the guest group at least a week before.',
          },
        ],
        joe: {
          de: 'Ich hatte einmal einen kurzen Einladungstext vorgeschlagen. In die Gruppe ging dann eine längere Fassung mit viel Lob für meine Großzügigkeit. Lieb gemeint, aber nicht abgesprochen, und ich wollte genau das nicht drin haben.',
          en: 'Once I suggested a short invitation text. What went into the group was a longer version with a lot of praise for my generosity. Kindly meant, but not agreed, and that was exactly what I did not want in it.',
        },
      },
      {
        id: 'vermieter',
        weight: 'pflicht',
        title: { de: 'Das Datum früh, damit ich den Vermieter informieren kann', en: 'The date early, so I can tell the landlord' },
        summary: {
          de: 'Mein Vermieter möchte vorher Bescheid wissen. Er ist einverstanden, solange zwei Dinge klappen: das Tor und die Zigarettenstummel.',
          en: 'My landlord wants to know beforehand. He is fine with it as long as two things work: the gate and the cigarette butts.',
        },
        details: [
          {
            de: 'Ob es ein nächstes Mal gibt, hängt an genau diesen zwei Punkten (siehe Etappe 02).',
            en: 'Whether there is a next time depends on exactly these two points (see stage 02).',
          },
        ],
        joe: {
          de: 'Seine Antwort auf meine Anfrage war ein Satz: Feier geht in Ordnung, wenn das mit dem Tor und dem Saubermachen der Zigaretten klappt.',
          en: 'His answer to my request was one sentence: the party is fine if the gate and cleaning up the cigarettes work out.',
        },
      },
    ],
  },
  // ------------------------------------------------------------------ 2
  {
    id: 'hausregeln',
    index: '02',
    tag: { de: 'Was immer gilt', en: 'What always applies' },
    title: { de: 'Die Hausregeln', en: 'The house rules' },
    lead: {
      de: 'Wenige Regeln, aber die gelten für jede Feier und für jeden Gast. Ihr seid dafür verantwortlich, dass eure Gäste sie kennen.',
      en: 'Only a few rules, but they apply to every party and every guest. You are responsible for your guests knowing them.',
    },
    steps: [
      {
        id: 'socken',
        weight: 'pflicht',
        title: { de: 'Ohne Straßenschuhe: Socken oder Hausschuhe', en: 'No street shoes: socks or slippers' },
        summary: {
          de: 'Im Salon wird ohne Schuhe gefeiert. Hausschuhe sind erlaubt. Die Leute gehen mit einem Ort viel respektvoller um, wenn sie keine Schuhe anhaben.',
          en: 'In the salon we party without shoes. Slippers are allowed. People treat a place with much more respect when they are not wearing shoes.',
        },
        details: [
          {
            de: 'Die Schuhe bleiben draußen im Treppenhaus vor der Ladentür, auch auf den Stufen nach oben im zweiten Stock. Dort ist viel Platz, ein Schuhregal braucht es nicht.',
            en: 'Shoes stay outside in the stairwell in front of the salon door, also on the stairs up on the second floor. There is plenty of room, no shoe rack needed.',
          },
          {
            de: 'Ein Teppich für den großen Raum ist schön, aber kein Muss.',
            en: 'A rug for the big room is nice but not a must.',
          },
          {
            de: 'In der Einladung ansagen, damit alle ihre schönsten Socken anziehen.',
            en: 'Say it in the invitation so everyone wears their nicest socks.',
          },
        ],
      },
      {
        id: 'absperrband',
        weight: 'pflicht',
        title: { de: 'Keine geschlossenen Türen: Absperrband mit Spruch', en: 'No closed doors: barrier tape with a sign' },
        summary: {
          de: 'Räume, die nicht benutzt werden, sperrt ihr mit Absperrband und einem kleinen Schild. Ich mag keine geschlossenen Türen bei mir.',
          en: 'Rooms that are not used, you close off with barrier tape and a small sign. I do not like closed doors in my place.',
        },
        details: [
          {
            de: 'Das Band und das Schild besorgt ihr. Gibt es kein echtes Absperrband, geht auch buntes Band mit einem Zettel.',
            en: 'You get the tape and the sign. If there is no proper barrier tape, coloured tape with a note works too.',
          },
          {
            de: 'Welche Räume offen sind, klären wir beim Treffen.',
            en: 'Which rooms are open, we settle at the meeting.',
          },
        ],
      },
      {
        id: 'hoechstzahl',
        weight: 'pflicht',
        title: { de: 'Höchstens 100 Gäste, höchstens 120 in der Einladungsgruppe', en: 'At most 100 guests, at most 120 in the invitation group' },
        summary: {
          de: 'Im Salon feiern höchstens 100 Leute. Weil immer weniger kommen als zusagen, dürfen in der Gruppe mit der Einladung bis zu 120 Personen sein, nicht mehr.',
          en: 'At most 100 people party in the salon. Since fewer always come than say yes, the group with the invitation may hold up to 120 people, no more.',
        },
        details: [
          {
            de: 'Die Zahl gilt auch dann, wenn ihr mit anderen zusammenlegt: zwei Feiern teilen sich die 100.',
            en: 'The number still applies if you team up with others: two parties share the 100.',
          },
          {
            de: 'Wer nicht kommen kann, tritt aus der Einladungsgruppe aus. Eine kurze Umfrage eine Woche vorher zeigt, wie viele wirklich kommen.',
            en: 'Anyone who cannot come leaves the invitation group. A quick poll a week before shows how many are really coming.',
          },
          {
            de: 'Neue Leute einladen nur, solange ihr unter 120 in der Gruppe bleibt.',
            en: 'Invite new people only while the group stays under 120.',
          },
        ],
      },
      {
        id: 'tor',
        weight: 'pflicht',
        title: { de: 'Haustür und Tor bleiben zu, jemand ist unten', en: 'Front door and gate stay shut, someone is downstairs' },
        summary: {
          de: 'Samstags schließt die Haustür um 17 Uhr. Danach kommt niemand ohne euch rein, und die Tür zur Straße darf nicht offen stehen. Das ist eine Bitte meines Vermieters.',
          en: 'On Saturdays the front door locks at 5 pm. After that nobody gets in without you, and the door to the street must not be left open. That is my landlord\'s request.',
        },
        details: [
          {
            de: 'Legt Einlasszeiten fest, zum Beispiel eine Stunde, in der durchgehend jemand unten steht und alle reinlässt.',
            en: 'Set arrival times, for example one hour during which someone is downstairs all the time letting everyone in.',
          },
          {
            de: 'Wer später kommt, schreibt oder ruft an. Hängt einen Zettel mit einer Telefonnummer an die Tür, falls ein +1 ohne eure Nummer kommt.',
            en: 'Anyone arriving later texts or calls. Put a note with a phone number on the door in case a +1 shows up without your number.',
          },
          {
            de: 'Das große Garagentor kann nur offen bleiben, solange jemand unten ist. Sonst ist es zu.',
            en: 'The big garage gate may only stay open while someone is downstairs. Otherwise it is shut.',
          },
        ],
      },
      {
        id: 'rauchen',
        weight: 'pflicht',
        title: { de: 'Rauchen draußen, Kippen am nächsten Tag weg', en: 'Smoking outside, butts gone the next day' },
        summary: {
          de: 'Unten stehen zwei große Aschenbecher. Ihr stellt sie raus und leert sie am Tag danach, und ihr sammelt auch die Kippen daneben auf.',
          en: 'There are two big ashtrays downstairs. You put them out and empty them the next day, and you also pick up the butts next to them.',
        },
        details: [
          {
            de: 'Das ist der zweite Punkt, an dem mein Vermieter hängt. Eine Person dafür eintragen.',
            en: 'This is the second point my landlord cares about. Put one person down for it.',
          },
        ],
      },
      {
        id: 'im-salon',
        weight: 'optional',
        title: { de: 'Was im Salon schon da ist', en: 'What is already in the salon' },
        summary: {
          de: 'Damit ihr nicht doppelt schleppt: zwei kleine Kühlschränke, ein Eisfach, zwei große Aschenbecher und die Empfangstheke als DJ-Pult.',
          en: 'So you do not carry things twice: two small fridges, a freezer compartment, two big ashtrays and the reception desk as a DJ booth.',
        },
        details: [
          {
            de: 'Die Theke ist etwas niedrig. Eine kleine Kiste drauf, dann stehen die DJs bequem.',
            en: 'The desk is a little low. Put a small box on it and the DJs stand comfortably.',
          },
          {
            de: 'Sitzplätze gibt es wenige. Wer mehr will, bringt Sofas mit und nimmt sie wieder mit.',
            en: 'There are few seats. If you want more, bring sofas and take them back.',
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 3
  {
    id: 'organisieren',
    index: '03',
    tag: { de: 'Die Wochen davor', en: 'The weeks before' },
    title: { de: 'Organisieren', en: 'Organising' },
    lead: {
      de: 'Eine Aufgabenliste, jede Aufgabe mit einem Namen, und schnelle Antworten. Mehr braucht es nicht.',
      en: 'One task list, every task with a name, and quick answers. That is all it takes.',
    },
    steps: [
      {
        id: 'aufgaben',
        weight: 'pflicht',
        title: { de: 'Jede Aufgabe hat einen Namen', en: 'Every task has a name' },
        summary: {
          de: 'Ich stelle die Aufgabenliste als Umfrage in die Gruppe, ihr klickt an, worum ihr euch kümmert. Eine Aufgabe ohne Namen wird am Abend meine Aufgabe, und das ist nicht der Deal.',
          en: 'I post the task list as a poll in the group and you tick what you take care of. A task with no name becomes my task on the night, and that is not the deal.',
        },
        details: [
          {
            de: 'Jede Aufgabe aus der Liste steht in der Umfrage. Für Getränke und Sofas braucht es meistens zwei Leute.',
            en: 'Every task in the list is in the poll. Drinks and sofas usually need two people.',
          },
        ],
        list: [
          { de: 'Getränke organisieren, mit Eis und Bechern (selbst oder über Flaschenpost).', en: 'Drinks, including ice and cups (yourselves or via a delivery service like Flaschenpost).' },
          { de: 'Musik und Anlage klären, vorher Soundtest im Salon.', en: 'Music and sound system, with a sound check in the salon beforehand.' },
          { de: 'Absperrband mit Spruch besorgen und ungenutzte Räume absperren.', en: 'Get barrier tape with a sign and close off unused rooms.' },
          { de: 'Teppich für den großen Raum (optional).', en: 'A rug for the big room (optional).' },
          { de: 'Sofas hin und zurück bringen.', en: 'Sofas there and back.' },
          { de: 'Socken- oder Hausschuhparty in der Einladungsgruppe ansagen.', en: 'Announce the socks or slippers party in the invitation group.' },
          { de: 'Einlasszeiten festlegen, höchstens 100 Gäste und 120 in der Gruppe.', en: 'Set arrival times, at most 100 guests and 120 in the group.' },
          { de: 'Ecke für Jacken am Eingang einrichten.', en: 'Set up a corner for coats at the entrance.' },
          { de: 'Türdienst unten, ein bis zwei Leute.', en: 'Door duty downstairs, one or two people.' },
          { de: 'Zettel mit Telefonnummer an die Haustür.', en: 'A note with a phone number on the front door.' },
          { de: 'Aschenbecher rausstellen und Kippen danach aufsammeln.', en: 'Put out the ashtrays and pick up the butts afterwards.' },
          { de: 'Aufräumen und Putzen am Sonntag.', en: 'Tidying and cleaning on Sunday.' },
        ],
        joe: {
          de: 'Bei beiden Feiern blieben in der Umfrage Aufgaben ohne einen einzigen Haken stehen: einmal der Türdienst, einmal der Transport der Sofas und die Aschenbecher. Am Ende hat es geklappt, aber erst nach Nachfragen.',
          en: 'At both parties, tasks in the poll were left without a single tick: once the door duty, once moving the sofas and the ashtrays. In the end it worked out, but only after chasing.',
        },
      },
      {
        id: 'antworten',
        weight: 'empfohlen',
        title: { de: 'Antworten innerhalb eines Tages, auch ein Nein', en: 'Answer within a day, even if it is a no' },
        summary: {
          de: 'Wenn ich in der Gruppe frage, reicht ein kurzes „kann ich" oder „kann ich nicht". Ein schnelles Nein ist mir lieber als ein langes Schweigen.',
          en: 'When I ask in the group, a short "I can" or "I can\'t" is enough. A quick no is better for me than a long silence.',
        },
        details: [
          {
            de: 'Wer verreist ist oder wenig aufs Handy schaut, sagt das einmal in der Gruppe. Dann weiß ich, mit wem ich rechnen kann.',
            en: 'If you are travelling or rarely check your phone, say so once in the group. Then I know whom I can count on.',
          },
        ],
        joe: {
          de: 'Als ich für eine Feier ein Sofa gefunden hatte und Hilfe beim Transport brauchte, kamen die Antworten über mehrere Tage, weil fast alle verreist waren. Das ist völlig in Ordnung. Hätte ich es am ersten Tag gewusst, hätte ich früher eine andere Lösung gesucht.',
          en: 'When I had found a sofa for a party and needed help moving it, the answers came over several days because nearly everyone was travelling. That is completely fine. Had I known on day one, I would have looked for another solution sooner.',
        },
      },
      {
        id: 'getraenke',
        weight: 'pflicht',
        title: { de: 'Getränke, Eis und Becher', en: 'Drinks, ice and cups' },
        summary: {
          de: 'Ihr kauft selbst ein oder bestellt über Flaschenpost, und ihr nehmt das Pfand wieder mit. Macht einen festen Termin aus, wann eingekauft oder geliefert wird.',
          en: 'You shop yourselves or order from a delivery service like Flaschenpost, and you take the empties back. Fix a time for when you shop or the delivery comes.',
        },
        details: [
          {
            de: 'Mehrwegbecher statt Einweg. Ein eigener Kühlschrank für die Bar ist willkommen, wenn ihr ihn vorher ansagt.',
            en: 'Reusable cups instead of disposable ones. Your own fridge for the bar is welcome if you announce it beforehand.',
          },
          {
            de: 'Flaschenpost liefert bis vor die Tür und nimmt Leergut wieder mit, kostet aber etwas mehr. Wer selbst kauft: wer das Auto hat, wer trägt, wann, in die Gruppe schreiben.',
            en: 'Flaschenpost delivers to the door and takes empties back, but costs a little more. If you shop yourselves: who has the car, who carries, when, write it in the group.',
          },
        ],
      },
      {
        id: 'musik',
        weight: 'empfohlen',
        title: { de: 'Musik und Anlage: Soundtest vorher', en: 'Music and sound system: sound check first' },
        summary: {
          de: 'Ihr könnt eure eigene oder eine gemietete Anlage mitbringen. Macht vorher einen kurzen Soundtest im Salon, und kümmert euch früh um Leute, die auflegen.',
          en: 'You can bring your own or a rented sound system. Do a short sound check in the salon beforehand, and sort out people to DJ early.',
        },
        details: [
          {
            de: 'Kabel und Kisten, die jemandem gehören, markieren, dann geht beim Abbau nichts verloren.',
            en: 'Mark cables and boxes that belong to someone, then nothing gets lost when packing up.',
          },
          {
            de: 'Wenn niemand auflegt, ist ein fertiges Set auch in Ordnung.',
            en: 'If nobody DJs, a ready-made set is fine too.',
          },
        ],
      },
      {
        id: 'aufbau',
        weight: 'pflicht',
        title: { de: 'Aufbau: Zeiten mit mir abmachen', en: 'Setting up: agree the times with me' },
        summary: {
          de: 'Aufbauen könnt ihr am Freitag ab 18 Uhr, nicht früher, denn bis dahin sind Kund:innen da. Die genaue Uhrzeit sagen wir in der Gruppe ab.',
          en: 'You can set up on Friday from 6 pm, not earlier, because clients are in until then. We agree the exact time in the group.',
        },
        details: [
          {
            de: 'Sagt an, mit wie vielen Leuten ihr kommt, und was ihr aufstellt (Bar, Kühlschrank, Anlage).',
            en: 'Say how many of you are coming and what you set up (bar, fridge, sound system).',
          },
          {
            de: 'Am Tag der Feier ist der Salon den ganzen Tag zu.',
            en: 'On the day of the party the salon is closed all day.',
          },
        ],
      },
      {
        id: 'einlass',
        weight: 'pflicht',
        professions: HALBOFFEN,
        title: { de: 'Gästeliste und Einlass die ganze Nacht', en: 'Guest list and door all night' },
        summary: {
          de: 'Bei einem halb offenen Event kommen Leute, die ihr nicht kennt. Deshalb gibt es eine Gästeliste, und unten steht die ganze Nacht jemand, der nur Leute von der Liste reinlässt.',
          en: 'At a semi-open event people come whom you do not know. So there is a guest list, and someone stands downstairs all night letting in only people on the list.',
        },
        details: [
          {
            de: 'Feste Zeiten, zu denen eingelassen wird, und eine Nummer für alle, die später kommen.',
            en: 'Fixed times for letting people in, and one number for anyone arriving later.',
          },
          {
            de: 'Der Türdienst wechselt sich ab. Tragt die Schichten vorher ein.',
            en: 'Door duty takes turns. Put the shifts down beforehand.',
          },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 4
  {
    id: 'danach',
    index: '04',
    tag: { de: 'Der Tag danach', en: 'The day after' },
    title: { de: 'Aufräumen und zurückgeben', en: 'Clean up and hand back' },
    lead: {
      de: 'Am Montag kommen wieder Kund:innen. Bis dahin ist der Salon so, wie ihr ihn bekommen habt.',
      en: 'On Monday clients are back. By then the salon is the way you found it.',
    },
    steps: [
      {
        id: 'putzen',
        weight: 'pflicht',
        title: { de: 'Putzen bis zur abgemachten Uhrzeit', en: 'Cleaning by the agreed time' },
        summary: {
          de: 'Am Tag nach der Feier räumt ihr auf und putzt. Ich sage vorher, bis wann alles fertig sein muss, und das gilt.',
          en: 'The day after the party you tidy up and clean. I say beforehand by when everything has to be done, and that holds.',
        },
        details: [
          {
            de: 'Wer am Morgen nicht kann, sagt es in der Gruppe und übergibt den Start an jemand anderen. So hat es bisher gut geklappt.',
            en: 'Whoever cannot make it in the morning says so in the group and hands the start to someone else. That has worked well so far.',
          },
          {
            de: 'Sofas, Anlage, Kühlschrank und Bar wieder raus, Aschenbecher leeren, Kippen draußen aufsammeln.',
            en: 'Sofas, sound system, fridge and bar out again, ashtrays emptied, butts outside picked up.',
          },
        ],
        joe: {
          de: 'Einmal hatte ich am Sonntag um 17 Uhr ein Bewerbungsgespräch im Salon, also musste bis 16:30 alles fertig sein. Es hat geklappt.',
          en: 'Once I had a job interview in the salon on Sunday at 5 pm, so everything had to be done by 4:30. It worked.',
        },
      },
      {
        id: 'stehen-lassen',
        weight: 'empfohlen',
        title: { de: 'Etwas stehen lassen? Vorher fragen', en: 'Leaving something behind? Ask first' },
        summary: {
          de: 'Anlage, Pfand oder ein Teppich dürfen nach Absprache ein paar Tage bleiben. Fragt früh, dann kann ich es mit dem Salonbetrieb planen.',
          en: 'Sound system, empties or a rug may stay a few days if we agree. Ask early so I can plan it around the salon.',
        },
        joe: {
          de: 'So geht es richtig: Eine Gruppe hat schon in der Woche davor gefragt, ob sie Anlage und Pfand nach der Feier bis Montag bei mir lassen darf, und eine andere, ob der Teppich eine Woche bis zu ihrer eigenen Feier bleiben darf. Beides war kein Problem, weil ich es rechtzeitig wusste.',
          en: 'This is how it is done: one group asked the week before whether they could leave their sound system and empties with me until Monday, and another whether the rug could stay a week until their own party. Both were no problem because I knew in time.',
        },
        details: [],
      },
    ],
  },
  // ------------------------------------------------------------------ 5
  {
    id: 'bezahlung',
    index: '05',
    tag: { de: 'Fair für alle', en: 'Fair for everyone' },
    title: { de: 'Bezahlung', en: 'Payment' },
    lead: {
      de: 'Eine Miete für den Salon gibt es nicht. Unter Freunden bekomme ich, was von den Getränken übrig bleibt. Bei einem halb offenen Event bekomme ich einen Anteil am Gewinn.',
      en: 'There is no rent for the salon. Among friends I get whatever is left from the drinks. At a semi-open event I get a share of the profit.',
    },
    steps: [
      {
        id: 'getraenkebeitrag',
        weight: 'pflicht',
        professions: ['freunde'],
        title: { de: 'Ein Beitrag für die Getränke, der Überschuss geht an mich', en: 'A contribution for drinks, the surplus goes to me' },
        summary: {
          de: 'Ihr bittet eure Gäste um einen Beitrag für die Getränke. Was nach dem Einkauf übrig bleibt, gebt ihr mir nach der Feier. Weitere Kosten gibt es für Freunde nicht.',
          en: 'You ask your guests for a contribution towards the drinks. Whatever is left after the shopping, you give me after the party. There are no further costs for friends.',
        },
        details: [
          {
            de: 'Bietet zwei Wege zum Zahlen an. Ein QR-Code allein war für manche Gäste am Handy umständlich.',
            en: 'Offer two ways to pay. A QR code on its own was awkward on the phone for some guests.',
          },
          {
            de: 'Hebt die Kassenzettel auf und sagt mir kurz, was reinkam und was ausgegeben wurde.',
            en: 'Keep the receipts and briefly tell me what came in and what was spent.',
          },
        ],
        joe: {
          de: 'Die dreifache Geburtstagsfeier hat es so gemacht: Die Gäste haben etwas für die Getränke gegeben, und den Gewinn haben mir die Organisator:innen danach gegeben. Für Freunde finde ich das genau richtig.',
          en: 'The triple birthday party did it like this: the guests chipped in for the drinks, and afterwards the organisers gave me the profit. For friends I think that is exactly right.',
        },
      },
      {
        id: 'gewinnanteil',
        weight: 'pflicht',
        professions: HALBOFFEN,
        title: { de: '35 % des Gewinns gehen an mich', en: '35% of the profit goes to me' },
        summary: {
          de: 'Bei einem halb offenen Event bekomme ich 35 % des Gewinns, also von dem, was nach allen Ausgaben übrig bleibt. Ihr gebt es mir nach der Feier.',
          en: 'At a semi-open event I get 35% of the profit, meaning what is left after all expenses. You give it to me after the party.',
        },
        details: [
          {
            de: 'Gewinn ist alles, was reinkommt (Eintritt, Getränke, Spenden), weniger das, was ihr für die Feier ausgegeben habt.',
            en: 'Profit is everything that comes in (entry, drinks, donations) minus what you spent on the party.',
          },
          {
            de: 'Hebt die Kassenzettel auf und schickt mir die Abrechnung in die Gruppe: was reinkam, was ausgegeben wurde, was übrig bleibt.',
            en: 'Keep the receipts and send me the tally in the group: what came in, what was spent, what is left.',
          },
          {
            de: 'Bietet zwei Wege zum Zahlen an. Ein QR-Code allein war für manche Gäste am Handy umständlich.',
            en: 'Offer two ways to pay. A QR code on its own was awkward on the phone for some guests.',
          },
        ],
      },
    ],
  },
];

export const PARTY_ROAD: RoadDefinition<PartyId> = {
  slug: 'party4friends',
  name: 'Party4Friends',
  storageKey: 'fw_party4friends_v1',
  professions: PARTY_KINDS,
  phases: PARTY_PHASES,
  copy: {
    choiceId: 'art-der-feier',
    choiceHeading: { de: 'Was für eine Feier?', en: 'What kind of party?' },
    choiceLead: {
      de: 'Eine Feier unter Freunden braucht weniger als ein halb offenes Event, zu dem Gäste Leute mitbringen. Wählt, was ihr plant. Wählt ihr nichts, seht ihr alles.',
      en: 'A party among friends needs less than a semi-open event where guests bring people along. Pick what you are planning. Pick nothing and you see everything.',
    },
    choiceGroupLabel: { de: 'Art der Feier wählen', en: 'Choose the kind of party' },
    hiddenCount: {
      de: '{n} Schritte ausgeblendet, die für eure Feier nicht gelten.',
      en: '{n} steps hidden that do not apply to your party.',
    },
    emptyPhase: {
      de: 'In dieser Etappe gibt es für eure Feier nichts zu tun.',
      en: 'Nothing to do in this stage for your party.',
    },
    storageNote: {
      de: 'Häkchen, Notizen und eure Auswahl werden nur auf diesem Gerät gespeichert, im lokalen Speicher deines Browsers. Nichts davon wird an FareWell oder Dritte übertragen. Wenn du deine Website-Daten löschst, den Browser wechselst oder im privaten Modus surfst, ist der Stand weg. Mit „Stand exportieren" kannst du ihn als Datei an die anderen schicken.',
      en: 'Ticks, notes and your choice are stored only on this device, in your browser\'s local storage. None of it is sent to FareWell or third parties. If you clear your site data, switch browsers or browse in private mode, your progress is gone. With "Export progress" you can send it to the others as a file.',
    },
    resetConfirm: {
      de: 'Alle Häkchen, Notizen und die Auswahl auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen.',
      en: 'Delete all ticks, notes and the choice on this device? This cannot be undone.',
    },
    notePlaceholder: {
      de: 'Wer kümmert sich, was ist abgemacht, was fehlt noch?',
      en: 'Who takes care of it, what is agreed, what is still missing?',
    },
  },
};
