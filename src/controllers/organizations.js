import {
	createOrganization,
	AssignCategoryToOrganization,
	findAllApprovedOrganizations,
	findPendingListOfOrganizations,
	findOrganizationById,
	setOrganizationStatus,
} from '../db/organizations.js'
import { OrganizationStatus } from '../db/definitions.js'
import { parseCSV } from '../utils/csvParser.js'

// GET /api/organizations
export const getAll = async (req, res) => {
	const organizations = await findAllApprovedOrganizations()
	res.json(organizations)
}

// GET /api/organizations/pending
export const getPending = async (req, res) => {
	const organizations = await findPendingListOfOrganizations()
	res.json(organizations)
}

// GET /api/organizations/:id
export const getById = async (req, res) => {
	const id = parseInt(req.params.id, 10)
	if (isNaN(id)) {
		return res.status(400).json({ message: 'Invalid organization ID' })
	}

	const org = await findOrganizationById(id)
	if (!org) {
		return res.status(404).json({ message: 'Organization not found' })
	}

	res.json(org)
}

// POST /api/organizations
export const create = async (req, res) => {
	const { name, description, websiteUrl, categoryIds } = req.body

	if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
		return res
			.status(400)
			.json({ message: 'categoryIds must be a non-empty array' })
	}

	const org = await createOrganization({ name, description, websiteUrl })

	await Promise.all(
		categoryIds.map(categoryId =>
			AssignCategoryToOrganization(org.id, categoryId),
		),
	)

	res.status(201).json(org)
}

// PUT /api/organizations/:id/status
export const updateStatus = async (req, res) => {
	const id = parseInt(req.params.id, 10)
	if (isNaN(id)) {
		return res.status(400).json({ message: 'Invalid organization ID' })
	}

	const { status, rejectionReason } = req.body

	const validStatuses = Object.values(OrganizationStatus)
	if (!validStatuses.includes(status)) {
		return res
			.status(400)
			.json({ message: `Invalid status. Allowed: ${validStatuses.join(', ')}` })
	}

	const org = await findOrganizationById(id)
	if (!org) {
		return res.status(404).json({ message: 'Organization not found' })
	}

	const updated = await setOrganizationStatus(
		id,
		status,
		rejectionReason ?? null,
	)
	res.json(updated)
}

// POST /api/organizations/import
export const importCSV = async (req, res) => {
	if (!req.file) {
		return res
			.status(400)
			.json({ errors: [{ field: 'file', message: 'CSV file is required' }] })
	}

	const { rows, errors: parseErrors } = await parseCSV(req.file.buffer)

	if (!rows.length && parseErrors.length) {
		return res.status(400).json({ errors: parseErrors })
	}

	const errors = [...parseErrors]
	const validRows = []

	// Валідація рядків
	for (const [i, row] of rows.entries()) {
		const rowNum = i + 2
		if (!row.name || row.name.trim().length < 2) {
			errors.push({
				row: rowNum,
				field: 'name',
				message: 'name is required (min 2 chars)',
			})
			continue
		}
		validRows.push({ ...row, _rowNum: rowNum })
	}

	const created = []

	for (const row of validRows) {
		const org = await createOrganization({
			name: row.name.trim(),
			description: row.description?.trim() || null,
			websiteUrl: row.websiteUrl?.trim() || null,
		})
		created.push(org.id)
	}

	res.status(207).json({ created: created.length, errors })
}
