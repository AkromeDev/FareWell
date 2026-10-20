import { TestBed } from '@angular/core/testing';
import { InternSealService, SealedEnvelope, sealContext } from './intern-seal.service';

const toBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));

/** Versiegelt wie tools/seal-intern.mjs, mit wenigen Runden, damit der Test schnell bleibt. */
async function seal(slug: string, value: unknown, password: string): Promise<SealedEnvelope> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 1000 },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );
  const data = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: encoder.encode(sealContext(slug)) },
    key,
    encoder.encode(JSON.stringify(value)),
  );
  return {
    v: 1,
    slug,
    kdf: 'PBKDF2-SHA256',
    iterations: 1000,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(data)),
    test: true,
  };
}

describe('InternSealService', () => {
  let service: InternSealService;

  beforeEach(() => {
    service = TestBed.inject(InternSealService);
  });

  it('öffnet ein Siegel mit dem richtigen Passwort', async () => {
    const envelope = await seal('quick-start-test', { v: 1, hallo: 'Welt' }, 'richtig');
    expect(await service.open<{ hallo: string }>(envelope, 'richtig')).toEqual({ v: 1, hallo: 'Welt' } as never);
  });

  it('bleibt zu mit einem falschen Passwort', async () => {
    const envelope = await seal('quick-start-test', { v: 1 }, 'richtig');
    expect(await service.open(envelope, 'falsch')).toBeNull();
  });

  it('bleibt zu, wenn das Siegel unter einer anderen Seite liegt', async () => {
    const envelope = await seal('quick-start-leo', { v: 1 }, 'richtig');
    expect(await service.open({ ...envelope, slug: 'quick-start-ruslana' }, 'richtig')).toBeNull();
  });
});
