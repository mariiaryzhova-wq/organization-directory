import { prisma } from '../utils/db.js'

// GET /api/categories
export const getAll = async (_req, res) => {
	const categories = await prisma.category.findMany({
		orderBy: { name: 'asc' },
	})
	res.json(categories)
}
