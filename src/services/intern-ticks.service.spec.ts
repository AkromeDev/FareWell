import { TestBed } from '@angular/core/testing';
import { InternTicksService } from './intern-ticks.service';

const ITEM = 'a'.repeat(64);

describe('InternTicksService', () => {
  let service: InternTicksService;

  beforeEach(() => {
    service = TestBed.inject(InternTicksService);
  });

  it('gibt jeder Aufgabe eine feste Kennung, die vom Schlüssel abhängt', async () => {
    const id = await service.itemId('geheim', 'Vertrag lesen');
    expect(id).toMatch(/^[0-9a-f]{64}$/);
    expect(await service.itemId('geheim', 'Vertrag lesen')).toBe(id);
    expect(await service.itemId('anders', 'Vertrag lesen')).not.toBe(id);
  });

  it('liest die Häkchen über qs_ticks_get', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.resolveTo(
      new Response(JSON.stringify([{ item: ITEM, done: true, updated_at: '2026-10-27T10:00:00Z' }])),
    );
    const ticks = await service.load('geheim');
    expect(ticks?.get(ITEM)).toEqual({ done: true, at: '2026-10-27T10:00:00Z' });
    const [url, init] = fetchSpy.calls.mostRecent().args;
    expect(String(url)).toMatch(/\/rest\/v1\/rpc\/qs_ticks_get$/);
    expect(JSON.parse(init!.body as string)).toEqual({ p_secret: 'geheim' });
  });

  it('gibt null zurück, wenn der Speicher nicht antwortet', async () => {
    spyOn(window, 'fetch').and.rejectWith(new TypeError('offline'));
    expect(await service.load('geheim')).toBeNull();
    expect(await service.set('geheim', ITEM, true)).toBeFalse();
  });

  it('meldet ein Häkchen als nicht gespeichert, wenn der Speicher es ablehnt', async () => {
    spyOn(window, 'fetch').and.resolveTo(new Response('false'));
    expect(await service.set('geheim', ITEM, true)).toBeFalse();
  });
});
