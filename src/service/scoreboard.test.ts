import { calculatePoints } from './scoreboard';

describe('calculatePoints test', () => {
    it('should generate correct score points', () => {
        let points = calculatePoints(36, 0, 0, 0);
        expect(points).toEqual(0);

        points = calculatePoints(36, 1, 1, 0);
        expect(points).toEqual(5);

        points = calculatePoints(40, 1, 0, 1);
        expect(points).toEqual(8);

        points = calculatePoints(35, 0, 0, 0);
        expect(points).toEqual(-1);
    });
});
