import {prisma} from '../db/prisma.js';
import {OrganizationStatus} from '../../prisma/schema.prisma';

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
                created_at: 'desc',
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
                org_id: Number(orgId),
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to find organization by ID: ${orgId}`);
    }
}

export async function approveOrganization(orgId) {
    try {
        return await prisma.organization.update({
            where: {
                org_id: Number(orgId),
            },
            data: {
                status: OrganizationStatus.approved,
                approved_at: new Date(),
                rejection_reason: null,
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Failed to approve organization: ${orgId}`);
    }
}

export async function rejectOrganization(
    orgId,
    rejectionReason
) {
    try {
        return await prisma.organization.update({
            where: {
                org_id: Number(orgId),
            },

            data: {
                status: OrganizationStatus.rejected,
                rejection_reason: rejectionReason,
            },
        });
    } catch (error) {
       console.error('Database Error:', error);
       throw new Error(`Failed to reject organization: ${orgId}`);
    }
}
