const pool = require('../db/db');

// TODO: SQL запити до таблиці ORGANIZATIONS
export async function createOrganization(data) {
    const {
        name,
        description,
        website_url,
    } = data;

    const [result] = await pool.query(
        `
    INSERT INTO organizations (
      name,
      description,
      website_url
    )
    VALUES (?, ?, ?)
    `,
        [
            name,
            description,
            website_url,
        ]
    );

    return findOrganizationById(result.insertId);
}

export async function findAllOrganizations(){
    const [rows] = await pool.query(`
        SELECT *
        FROM organizations
    `);
    return rows;
}

export async function findOrganizationById(orgId) {
    const [rows] = await pool.query(
        `
    SELECT *
    FROM organizations
    WHERE org_id = ?
    `,
        [orgId]
    );

    return rows[0] ?? null;
}

export async function approveOrganization(orgId) {
    await pool.query(
        `
    UPDATE organizations
    SET
      status = 'approved',
      approved_at = NOW(),
      rejection_reason = NULL
    WHERE org_id = ?
    `,
        [orgId]
    );

    return findOrganizationById(orgId);
}

export async function rejectOrganization(
    orgId,
    rejectionReason
) {
    await pool.query(
        `
    UPDATE organizations
    SET
      status = 'rejected',
      rejection_reason = ?
    WHERE org_id = ?
    `,
        [rejectionReason, orgId]
    );

    return findOrganizationById(orgId);
}
