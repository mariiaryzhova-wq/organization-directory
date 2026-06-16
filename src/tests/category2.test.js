import { prisma } from '../db/prisma.js';
import { OrganizationStatus } from '../db/definitions.js';

// Запити до таблиці CATEGORIES та ORGANIZATION_CATEGORIES
// Запит на отримання всіх категорій
export async function findAllCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch all categories');
    }
}

// Запит на отримання підтверджених організацій, за категорією
export async function getApprovedOrganizationsByCategory(categoryId) {
    try {
        return await prisma.organization.findMany({
            where: {
                status: OrganizationStatus.approved,

                categories: {
                    some: {
                        id: Number(categoryId),
                    },
                },
            },

            orderBy: {
                name: 'asc',
            },
        });

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch approved organizations by category');
    }
}
test('Мой третий проверочный тест', () => {
  expect(1 + 1).toBe(2);
});