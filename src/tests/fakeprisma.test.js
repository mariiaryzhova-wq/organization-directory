// Фейкова реалізація Prisma Client в пам'яті для інтеграційних тестів.
// Підтримує мінімальний підмножину API, що використовується репозиторіями
// organization.js та category.js.

export function createFakePrisma(seed = {}) {
    const state = {
        organizations: seed.organizations ? structuredClone(seed.organizations) : [],
        categories: seed.categories ? structuredClone(seed.categories) : [],
        organizationCategories: seed.organizationCategories ? structuredClone(seed.organizationCategories) : [],
        locations: seed.locations ? structuredClone(seed.locations) : [],
        nextOrgId: seed.nextOrgId ?? 1000,
        nextLocationId: seed.nextLocationId ?? 5000,
    };

    function withRelations(org) {
        const categories = state.organizationCategories
            .filter(oc => oc.organizationId === org.id)
            .map(oc => ({ category: state.categories.find(c => c.id === oc.categoryId) }));

        const locations = state.locations
            .filter(l => l.organizationId === org.id)
            .map(l => ({
                locationId: l.locationId,
                street: l.street,
                city: l.city,
                region: l.region,
                postCode: l.postCode,
                latitude: l.latitude,
                longitude: l.longitude,
            }));

        return { ...org, categories, locations };
    }

    function matchesGeo(org, geoFilter) {
        if (!geoFilter?.locations?.some) return true;
        const cond = geoFilter.locations.some;
        return state.locations
            .filter(l => l.organizationId === org.id)
            .some(l =>
                l.latitude >= cond.latitude.gte && l.latitude <= cond.latitude.lte &&
                l.longitude >= cond.longitude.gte && l.longitude <= cond.longitude.lte
            );
    }

    return {
        organization: {
            async create({ data }) {
                const id = state.nextOrgId++;
                const org = {
                    id,
                    name: data.name,
                    description: data.description ?? null,
                    websiteUrl: data.websiteUrl ?? null,
                    status: data.status,
                    rejectionReason: null,
                    createdAt: new Date(),
                };
                state.organizations.push(org);

                for (const c of data.categories?.create ?? []) {
                    state.organizationCategories.push({
                        organizationId: id,
                        categoryId: c.category.connect.id,
                    });
                }

                for (const loc of data.locations?.create ?? []) {
                    const locationId = state.nextLocationId++;
                    state.locations.push({ locationId, organizationId: id, ...loc });
                }

                return withRelations(org);
            },

            async findMany({ where, orderBy, take, skip }) {
                let results = state.organizations.filter(org => {
                    if (where.status !== undefined && org.status !== where.status) return false;

                    if (where.categories?.some?.categoryId !== undefined) {
                        const has = state.organizationCategories.some(
                            oc => oc.organizationId === org.id && oc.categoryId === where.categories.some.categoryId
                        );
                        if (!has) return false;
                    }

                    // Реплікація репозиторію category.js: where.categories.some.id
                    // OrganizationCategory у схемі не має власного поля "id", що
                    // дорівнювало б categoryId -> такий фільтр ніколи не знаходить збігів.
                    // (BUG-02, див. звіт про тестування)
                    if (where.categories?.some?.id !== undefined) {
                        const has = state.organizationCategories.some(
                            oc => oc.organizationId === org.id && oc.id === where.categories.some.id
                        );
                        if (!has) return false;
                    }

                    if (where.locations?.some && !matchesGeo(org, where)) return false;

                    return true;
                });

                if (orderBy?.createdAt === 'desc') {
                    results = [...results].sort((a, b) => b.createdAt - a.createdAt);
                }

                if (skip !== undefined) results = results.slice(skip);
                if (take !== undefined) results = results.slice(0, take);

                return results.map(withRelations);
            },

            async findUnique({ where }) {
                const org = state.organizations.find(o => o.id === where.id);
                return org ? withRelations(org) : null;
            },

            async update({ where, data }) {
                const org = state.organizations.find(o => o.id === where.id);
                if (!org) throw new Error('Record not found');
                org.status = data.status;
                org.rejectionReason = data.rejectionReason;
                return withRelations(org);
            },
        },

        category: {
            async findMany({ orderBy }) {
                let results = [...state.categories];
                if (orderBy?.name === 'asc') {
                    results.sort((a, b) => a.name.localeCompare(b.name));
                }
                return results;
            },
        },

        organizationCategory: {
            async create({ data }) {
                state.organizationCategories.push({ organizationId: data.organizationId, categoryId: data.categoryId });
                return data;
            },
        },

        __state: state,
    };
}
test('Мой двадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
