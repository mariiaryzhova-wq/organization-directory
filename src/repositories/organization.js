import { prisma } from '../db/prisma.js';
import { OrganizationStatus } from '../db/definitions.js';

// Запити до таблиці ORGANIZATIONS
export async function createOrganization(newOrganization) {
    // TODO insert categories to newOrganization
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

export async function findAllApprovedOrganizations(){
    try {
        return await prisma.organization.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                status: OrganizationStatus.approved,
            }
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
