import { getCandidateTimeZoneOffsets } from './get-candidate-time-zone-offsets';

describe('getCandidateTimeZoneOffsets', () => {
  it('returns one offset for a zone without a nearby transition', () => {
    expect(
      getCandidateTimeZoneOffsets(Date.parse('2026-08-20T15:30:01Z'), 'UTC'),
    ).toEqual(new Set([0]));
  });

  it('returns both offsets around a daylight-saving transition', () => {
    expect(
      getCandidateTimeZoneOffsets(
        Date.parse('2026-10-25T01:30:00Z'),
        'Europe/Madrid',
      ),
    ).toEqual(new Set([7_200_000, 3_600_000]));
  });
});
