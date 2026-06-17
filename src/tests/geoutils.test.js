// Утиліта для обчислення приблизного bounding box (прямокутника)
// навколо точки за заданими координатами та радіусом у кілометрах.
// Використовується для попередньої фільтрації локацій у БД
// перед/без точного обчислення відстані по формулі Haversine.

const EARTH_RADIUS_KM = 6371;

/**
 * @param {{ lat: number|string, lng: number|string, radiusKm: number|string }} geoParams
 * @returns {{ minLat: number, maxLat: number, minLng: number, maxLng: number }}
 */
export function getBoundingBox(geoParams) {
    const lat = Number(geoParams.lat);
    const lng = Number(geoParams.lng);
    const radiusKm = Number(geoParams.radiusKm);

    if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(radiusKm)) {
        throw new Error('Invalid geo parameters: lat, lng and radiusKm must be numbers');
    }

    // Кутове відхилення по широті (градуси на км приблизно стале)
    const latDelta = (radiusKm / EARTH_RADIUS_KM) * (180 / Math.PI);

    // Кутове відхилення по довготі залежить від широти
    const lngDelta = (radiusKm / EARTH_RADIUS_KM) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);

    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLng: lng - lngDelta,
        maxLng: lng + lngDelta,
    };
}
test('Мой двенадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
