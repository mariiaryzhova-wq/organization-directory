const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.getPendingOrganizations = async (req, res) => {
    try {
        const organizations = await prisma.organization.findMany({
            where: { moderation_status: 'PENDING' },
            include: {
                category: true,
                addresses: true,
                contacts: true,
                social_media: true,
                owner: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(organizations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при отриманні заявок' });
    }
};
exports.updateOrganizationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { moderation_status, moderation_notes } = req.body;

        if (moderation_status !== 'APPROVED' && moderation_status !== 'REJECTED') {
            return res.status(400).json({ message: 'Невірний статус' });
        }

        const organization = await prisma.organization.findUnique({
            where: { id: Number(id) }
        });

        if (!organization) {
            return res.status(404).json({ message: 'Організацію не знайдено' });
        }

        const updatedOrganization = await prisma.organization.update({
            where: { id: Number(id) },
            data: {
                moderation_status,
                moderation_notes,
                moderated_at: new Date(),
                moderated_by: req.user.id
            }
        });

        res.json({
            message: `Організацію ${moderation_status}`,
            organization: updatedOrganization
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при оновленні статусу' });
    }
};
