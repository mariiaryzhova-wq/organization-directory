// Контролер категорій — обробляє HTTP-запити для /api/categories
// Викликає функції з репозиторію category.js та формує JSON-відповідь
import { findAllCategories, getApprovedOrganizationsByCategory } from "../repositories/category.js"

// GET /api/categories
// Повертає список усіх категорій у системі
// Помилки бази даних автоматично перехоплюються asyncHandler → errorHandler
export const getAll = async (_req, res) => {
	const categories = await findAllCategories()
	res.json(categories)
}

// GET /api/categories/:id/organizations
// Повертає список підтверджених організацій за ID категорії
// Перевіряє валідність :id перед запитом до бази
export const getApprovedByCategory = async (req, res) => {
	// Перетворюємо рядковий параметр з URL на ціле число
	const categoryId = parseInt(req.params.id, 10)

	// 400 — якщо :id не є числом (наприклад, /categories/abc/organizations)
	if (isNaN(categoryId)) {
		return res.status(400).json({
			errors: [{ field: 'id', message: 'Invalid category ID' }]
		})
	}

	const organizations = await getApprovedOrganizationsByCategory(categoryId)

	// 404 — якщо категорія існує, але в ній немає підтверджених організацій
	if (!organizations || organizations.length === 0) {
		return res.status(404).json({
			errors: [{ field: 'id', message: 'No organizations found for this category' }]
		})
	}

	res.json(organizations)
}
test('Мой второй проверочный тест', () => {
  expect(1 + 1).toBe(2);
});