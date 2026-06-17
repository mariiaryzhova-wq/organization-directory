import { getBoundingBox } from '../../src/utils/geoUtils.js';

describe('UNIT: utils/geoUtils.getBoundingBox', () => {
    test('TC-U01: повертає коректний bounding box для валідних координат', () => {
        const box = getBoundingBox({ lat: 47.9387, lng: 33.4324, radiusKm: 5 });

        expect(box.minLat).toBeLessThan(47.9387);
        expect(box.maxLat).toBeGreaterThan(47.9387);
        expect(box.minLng).toBeLessThan(33.4324);
        expect(box.maxLng).toBeGreaterThan(33.4324);
    });

    test('TC-U02: bounding box є симетричним відносно центральної точки', () => {
        const lat = 47.9387, lng = 33.4324, radiusKm = 5;
        const box = getBoundingBox({ lat, lng, radiusKm });

        expect(lat - box.minLat).toBeCloseTo(box.maxLat - lat, 10);
        expect(lng - box.minLng).toBeCloseTo(box.maxLng - lng, 10);
    });

    test('TC-U03: приймає координати у вигляді рядків (query params)', () => {
        const box = getBoundingBox({ lat: '47.9387', lng: '33.4324', radiusKm: '5' });

        expect(box.minLat).not.toBeNaN();
        expect(box.maxLng).not.toBeNaN();
    });

    test('TC-U04: радіус 0 повертає box, що дорівнює точці', () => {
        const box = getBoundingBox({ lat: 47.9387, lng: 33.4324, radiusKm: 0 });

        expect(box.minLat).toBeCloseTo(47.9387, 10);
        expect(box.maxLat).toBeCloseTo(47.9387, 10);
        expect(box.minLng).toBeCloseTo(33.4324, 10);
        expect(box.maxLng).toBeCloseTo(33.4324, 10);
    });

    test('TC-U05: викидає помилку при нечислових значеннях', () => {
        expect(() => getBoundingBox({ lat: 'abc', lng: 33.43, radiusKm: 5 })).toThrow();
    });

    test('TC-U06: довготний дельта зростає при наближенні до полюсів (cos знаменника)', () => {
        const boxEquator = getBoundingBox({ lat: 0, lng: 0, radiusKm: 100 });
        const boxNearPole = getBoundingBox({ lat: 80, lng: 0, radiusKm: 100 });

        const lngSpanEquator = boxEquator.maxLng - boxEquator.minLng;
        const lngSpanNearPole = boxNearPole.maxLng - boxNearPole.minLng;

        expect(lngSpanNearPole).toBeGreaterThan(lngSpanEquator);
    });
});
test('Мой восемадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
