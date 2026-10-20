import { Injectable } from '@angular/core';

/** Ein versiegelter Seiteninhalt, wie ihn tools/seal-intern.mjs schreibt. */
export interface SealedEnvelope {
  v: 1;
  slug: string;
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  iv: string;
  data: string;
  /** true: nur mit einem Testpasswort versiegelt, darf nicht veröffentlicht werden. */
  test: boolean;
}

/** Zusatzdaten, die ein Siegel an seine Seite binden. Derselbe Text wie in tools/seal-intern.mjs. */
export const sealContext = (slug: string): string => `farewell-intern:v1:${slug}`;

function bytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const result = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) result[i] = binary.charCodeAt(i);
  return result;
}

/**
 * Öffnet eine interne Seite im Browser: PBKDF2 mit SHA-256 macht aus Passwort
 * und Salt einen AES-256-GCM-Schlüssel, der den Inhalt entschlüsselt. Alles
 * passiert auf dem Gerät der Person, die die Seite öffnet. Das Passwort wird
 * weder gespeichert noch gesendet; lädt man neu, ist die Seite wieder zu.
 * Nur im Browser aufrufen, beim Prerendern gibt es weder fetch auf die eigene
 * Seite noch Web Crypto.
 */
@Injectable({ providedIn: 'root' })
export class InternSealService {
  /** Das Siegel der Seite, oder null, wenn es (noch) keins gibt. */
  async load(slug: string): Promise<SealedEnvelope | null> {
    const response = await fetch(`/assets/intern/${slug}.sealed.json`, { cache: 'no-store' });
    if (!response.ok) return null;
    const envelope = (await response.json()) as SealedEnvelope;
    return envelope.v === 1 && envelope.slug === slug ? envelope : null;
  }

  /** Der Klartext als JSON, oder null, wenn das Passwort nicht passt. */
  async open<T>(envelope: SealedEnvelope, password: string): Promise<T | null> {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) throw new Error('Dieser Browser kann die Seite nicht öffnen: Web Crypto fehlt.');
    const encoder = new TextEncoder();
    const base = await subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt: bytes(envelope.salt), iterations: envelope.iterations },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    try {
      const plain = await subtle.decrypt(
        { name: 'AES-GCM', iv: bytes(envelope.iv), additionalData: encoder.encode(sealContext(envelope.slug)) },
        key,
        bytes(envelope.data),
      );
      return JSON.parse(new TextDecoder().decode(plain)) as T;
    } catch {
      // AES-GCM lehnt einen falschen Schlüssel ab: falsches Passwort oder ein Siegel einer anderen Seite.
      return null;
    }
  }
}
