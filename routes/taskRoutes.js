import express from 'express';
import { renderDashboard, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(isAuthenticated);

router.get('/dashboard', renderDashboard);
router.post('/tasks/create', createTask);
router.post('/tasks/:taskId/status', updateTaskStatus);
router.post('/tasks/:taskId/delete', deleteTask);

export default router;
