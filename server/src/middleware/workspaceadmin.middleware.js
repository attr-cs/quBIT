const jwt = require('jsonwebtoken');
const prisma = require('../../db/db');

const workspaceAdminMiddleware = async (req, res, next) => {
    try {
        const { id } = req.params;
        const workspace = await prisma.workspace.findUnique({
            where: {
                id
            }
        })
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found", data: null });
        }
        req.workspace = workspace;

        const isAllowed = workspace.ownerId === req.user.id;

        if (!isAllowed) {
            return res.status(403).json({ success: false, message: "Not authorised for this operation" });
        }
        return next();

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = workspaceAdminMiddleware;