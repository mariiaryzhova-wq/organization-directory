import { prisma } from '../db/prisma.js';
import { OrganizationStatus } from '../db/definitions.js';

// Запити до таблиці ORGANIZATIONS
    // Запит на додавання нової організації. Крок 1. Створення основних даних організації
export async function createOrganization(newOrganization) {
    try {
        return await prisma.organization.create({
            data: {
                name: newOrganization.name,
                description: newOrganization.description,
                websiteUrl: newOrganization.websiteUrl,
                status: OrganizationStatus.pending,
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create organization');
    }
}

// Запит на додавання нової організації. Крок 2. Додавання категорії до організації

export async function AssignCategoryToOrganization(orgId, categoryId) {
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

// Запит на отримання списку всіх підтверджених організацій
export async function findAllApprovedOrganizations(){
    try {
        return await prisma.organization.findMany({
            where: {
                status: OrganizationStatus.approved,
            },
            orderBy: {
                createdAt: 'desc',
            },
            // paginate: {
            //     limit: 10,
            //     offset: 0,
            // },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch all organizations');
    }
}

// Запит лист очікування на додавання організації
export async function findPendingListOfOrganizations(){
    try {
        return await prisma.organization.findMany({
            where: {
                status: OrganizationStatus.pending,
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

// Запит на отримання організації за її ID
export async function findOrganizationById(orgId) {
    try {
        return await prisma.organization.findUnique({
            where: {
                id: Number(orgId),
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
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to set organization status: ${orgId}`);
    }
}
