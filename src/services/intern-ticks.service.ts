import { Injectable } from '@angular/core';
import { SUPABASE_CONFIG, isSupabaseEnabled } from 'src/components/pages/tasks/config/supabase.config';

/** Ein Häkchen, wie es im gemeinsamen Speicher steht. */
export interface InternTick {
  done: boolean;
  /** Zuletzt geändert, als ISO-Zeitpunkt. */
  at: string;
}

/**
 * Die gemeinsamen Häkchen der internen Seiten. Sie liegen in derselben
 * Supabase-Datenbank wie die Aufgabenseiten (tasks/config/supabase.config.ts),
 * aber in eigenen Tabellen, an die man nur über zwei Funktionen kommt.
 * Einrichtung: src/components/pages/intern/quick-start/SUPABASE-SETUP.md.
 *
 * Der Schlüssel ist der geheime `sync`-Wert aus dem versiegelten Inhalt: wer die
 * Seite öffnen kann, kann auch abhaken. Gespeichert werden nur Hashes und
 * ja oder nein, nie ein Text der Seite. Das Passwort verlässt den Browser nicht.
 */
@Injectable({ providedIn: 'root' })
export class InternTicksService {
  /** Kennung einer Aufgabe im Speicher: SHA-256 aus Schlüssel und Aufgabe, hex. */
  async itemId(secret: string, key: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${secret}:${key}`));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }

  /** Alle Häkchen der Seite, oder null, wenn der Speicher nicht erreichbar ist. */
  async load(secret: string): Promise<Map<string, InternTick> | null> {
    const rows = await this.rpc<{ item: string; done: boolean; updated_at: string }[]>('qs_ticks_get', {
      p_secret: secret,
    });
    if (!Array.isArray(rows)) return null;
    return new Map(rows.map((r) => [r.item, { done: r.done, at: r.updated_at }]));
  }

  /** Setzt oder entfernt ein Häkchen. false, wenn es nicht gespeichert wurde. */
  async set(secret: string, item: string, done: boolean): Promise<boolean> {
    return (await this.rpc<boolean>('qs_tick_set', { p_secret: secret, p_item: item, p_done: done })) === true;
  }

  private async rpc<T>(fn: string, body: object): Promise<T | null> {
    if (!isSupabaseEnabled()) return null;
    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
      return response.ok ? ((await response.json()) as T) : null;
    } catch {
      return null;
    }
  }
}
