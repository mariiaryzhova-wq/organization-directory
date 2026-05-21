import { findAllCategories, getApprovedOrganizationsByCategory } from "../repositories/category.js"

// GET /api/categories
export const getAll = async (_req, res) => {
	const categories = await findAllCategories()
	res.json(categories)
}


export const getApprovedByCategory(req, res) => {
	const categoryId = parseInt(req.params.id, 10)
	if (isNaN(categoryId)) {
		return res.status(400).json({ message: 'Invalid category ID' })
	}
	const organizations = await getApprovedOrganizationsByCategory(categoryId)
	res.json(organizations)
}