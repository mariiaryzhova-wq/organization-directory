import { prisma } from '../db/prisma.js';
import { OrganizationStatus } from '../db/definitions.js';

// Запити до таблиці ORGANIZATIONS

// Створення нової організації.
export async function createOrganization(newOrganization, categoryIds) {
    try {
        return await prisma.organization.create({
            data: {
                name: newOrganization.name,
                description: newOrganization.description,
                websiteUrl: newOrganization.websiteUrl,
                status: OrganizationStatus.pending,
                categories: {
                    create: categoryIds.map((categoryId) => ({
                        category: {
                            connect: {
                                id: Number(categoryId),
                            },
                        },
                    })),
                },
            },
            include: {
                categories: {
                    select: { category: { select: { id: true, name: true } } },
                },
            },

        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create organization');
    }
}

// Призначення нової категорії до організації(organizationCategory)
export async function assignCategoryToOrganization(orgId, categoryId) {
    try {
        return await prisma.organizationCategory.create({
            data: {
                organizationId: Number(orgId),
                categoryId: Number(categoryId),
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to assign category to organization: ${orgId},${categoryId}`);
    }
}

// Пошук організацій за query parameters
export async function findOrganizations(filters, pagination){
    try {
        const { categoryId, status } = filters ?? {};

        return await prisma.organization.findMany({
            where: {
                status: status ?? OrganizationStatus.approved,
                ...(categoryId !== undefined ? {
                    categories: {
                        some: {
                            categoryId: Number(categoryId),
                        },
                    },
                } : {}),
            },
            include: {
                categories: {
                    select: { category: { select: { id: true, name: true } } },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            ...(pagination?.limit !== undefined ? { take: Number(pagination.limit) } : {}),
            ...(pagination?.offset !== undefined ? { skip: Number(pagination.offset) } : {}),
        });

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch organizations by query');
    }
}

// Пошук усіх організацій, що очікують на підтвердження
export async function findPendingListOfOrganizations(){
    try {
        return await prisma.organization.findMany({
            where: {
                status: OrganizationStatus.pending,
            },
            include: {
                categories: {
                    select: { category: { select: { id: true, name: true } } },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch pending list of organizations');
    }
}

// Пошук організації за ID
export async function findOrganizationById(orgId) {
    try {
        return await prisma.organization.findUnique({
            where: {
                id: Number(orgId),
            },
            include: {
                categories: {
                    select: { category: { select: { id: true, name: true } } },
                },
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to find organization by ID: ${orgId}`);
    }
}

// Запит на зміну статусу організації
export async function setOrganizationStatus(
    orgId,
    status,
    rejectionReason
) {
    try {
        return await prisma.organization.update({
            where: {
                id: Number(orgId),
            },

            data: {
                status: status,
                rejectionReason: rejectionReason,
            },
            include: {
                categories: {
                    select: { category: { select: { id: true, name: true } } },
                },
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to set organization status: ${orgId}`);
    }
}
