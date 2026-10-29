# Quick Start: gemeinsame Häkchen (Supabase)

Die Aufgaben auf den Quick-Start-Seiten lassen sich abhaken, und alle, die die Seite
öffnen können, sehen dieselben Häkchen. Sie liegen in der Supabase-Datenbank, die auch
die Aufgabenseiten nutzen (`tasks/config/supabase.config.ts`), in zwei eigenen Tabellen.
Kein eigener Server; der Browser ruft zwei Datenbankfunktionen auf
(`src/services/intern-ticks.service.ts`).

## Was gespeichert wird

- Jede Seite hat im versiegelten Inhalt einen geheimen Schlüssel `sync` (64 Hex-Zeichen).
  Wer die Seite öffnen kann, kennt ihn; sonst niemand.
- Die Datenbank kennt nur den SHA-256 dieses Schlüssels (`qs_pages`) und je Aufgabe einen
  SHA-256 aus Schlüssel und Aufgabe, dazu ja oder nein und die Zeit (`qs_ticks`).
  Kein Text der Seite, kein Name, kein Passwort.
- Ohne Schlüssel kommt niemand an die Tabellen: RLS ist an, es gibt keine Policies, nur die
  zwei Funktionen. Schreiben geht nur für Seiten, die in `qs_pages` stehen.
- Ist Supabase nicht erreichbar oder diese Einrichtung noch nicht gemacht, bleibt die
  Aufgabenliste wie vorher nur zum Lesen.

## Einmal einrichten

Supabase → das Projekt der Aufgabenseiten → **SQL Editor → New query**, alles einfügen, **Run**:

```sql
-- Die Seiten, die abhaken dürfen: SHA-256 (hex) ihres sync-Schlüssels.
create table public.qs_pages (
  page text primary key check (page ~ '^[0-9a-f]{64}$'),
  label text
);

-- Ein Häkchen je Seite und Aufgabe.
create table public.qs_ticks (
  page text not null references public.qs_pages (page) on delete cascade,
  item text not null check (item ~ '^[0-9a-f]{64}$'),
  done boolean not null,
  updated_at timestamptz not null default now(),
  primary key (page, item)
);

-- RLS an und keine Policies: direkt kommt niemand an die Tabellen, nur über die Funktionen.
alter table public.qs_pages enable row level security;
alter table public.qs_ticks enable row level security;
revoke all on public.qs_pages, public.qs_ticks from anon, authenticated;

-- Alle Häkchen einer Seite. Ein falscher Schlüssel bekommt eine leere Liste.
create function public.qs_ticks_get(p_secret text)
returns table (item text, done boolean, updated_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select t.item, t.done, t.updated_at
  from public.qs_ticks t
  where t.page = encode(sha256(convert_to(p_secret, 'UTF8')), 'hex')
$$;

-- Ein Häkchen setzen oder entfernen. false, wenn die Seite nicht freigeschaltet ist.
create function public.qs_tick_set(p_secret text, p_item text, p_done boolean)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
  v_page text := encode(sha256(convert_to(p_secret, 'UTF8')), 'hex');
begin
  if not exists (select 1 from public.qs_pages where page = v_page) then
    return false;
  end if;
  insert into public.qs_ticks (page, item, done)
  values (v_page, p_item, p_done)
  on conflict (page, item) do update set done = excluded.done, updated_at = now();
  return true;
end
$$;

revoke all on function public.qs_ticks_get(text) from public;
revoke all on function public.qs_tick_set(text, text, boolean) from public;
grant execute on function public.qs_ticks_get(text) to anon, authenticated;
grant execute on function public.qs_tick_set(text, text, boolean) to anon, authenticated;

-- Die zwei Seiten von heute.
insert into public.qs_pages (page, label) values
  ('b2caf4e54257305be7342e6dc86170af8a5aa6824b6c919bebfe4ada0d9ff840', 'quick-start-ruslana'),
  ('00ad612173e2b9eecbbc323a9b242455e276f455bf3f3035f99ef01fa44ad368', 'quick-start-leo');

-- Die Schnittstelle kennt die zwei Funktionen sofort, nicht erst beim nächsten Neuladen.
notify pgrst, 'reload schema';
```

Die zwei Hashes sind nicht geheim: aus ihnen lässt sich der Schlüssel nicht zurückrechnen.

## Eine neue Seite freischalten

Im Klartext der Seite einen `sync`-Schlüssel anlegen (`python3 -c "import secrets; print(secrets.token_hex(32))"`),
versiegeln, und seinen Hash in `qs_pages` eintragen:

```sql
insert into public.qs_pages (page, label)
values (encode(sha256(convert_to('<sync-Schlüssel>', 'UTF8')), 'hex'), '<slug>');
```

Den Schlüssel dafür nur in den SQL Editor tippen, nie in dieses Repository.

## Häkchen einer Seite löschen

`delete from public.qs_ticks where page = '<hash>';` Den Schlüssel einer Seite nie ändern:
die Häkchen hängen an ihm.
