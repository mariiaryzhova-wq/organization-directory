import {prisma} from '../db/prisma.js';
import {OrganizationStatus} from '../../prisma/schema.prisma';

// Запити до таблиці CATEGORIES та ORGANIZATION_CATEGORIES
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

export async function getApprovedOrganizationsByCategory(categoryId) {
    try {
        return await prisma.organization.findMany({
            where: {
                status: OrganizationStatus.approved,

                categories: {
                    some: {
                        category_id: Number(categoryId),
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
