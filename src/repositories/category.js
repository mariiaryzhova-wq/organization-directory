const pool = require('../db/db');

// TODO: SQL запити до таблиці CATEGORIES та ORGANIZATION_CATEGORIES
export async function findAllCategories() {
    const [rows] = await pool.query(`
        SELECT *
        FROM categories
        ORDER BY name
    `);
    return rows;
}

export async function getApprovedOrganizationsByCategory(categoryId) {
    const [rows] = await pool.query(`
        SELECT *
        FROM organizations o
         INNER JOIN organization_categories oc
            ON oc.org_id = o.org_id
        WHERE category_id = ?
          AND o.status = 'approved'
        ORDER BY name
    `, [categoryId]);
    return rows;
}
