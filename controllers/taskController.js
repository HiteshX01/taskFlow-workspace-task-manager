import { taskModel } from '../models/task.js';

export const renderDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { status, priority, category, search } = req.query;

    // Build filter object for MongoDB query
    const filter = { user: userId };

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Fetch user's tasks sorted by creation date (newest first)
    const tasks = await taskModel.find(filter).sort({ createdAt: -1 });

    // Aggregate statistics across ALL user tasks
    const allUserTasks = await taskModel.find({ user: userId });
    
    const stats = {
      total: allUserTasks.length,
      pending: allUserTasks.filter(t => t.status === 'pending').length,
      inProgress: allUserTasks.filter(t => t.status === 'in_progress').length,
      completed: allUserTasks.filter(t => t.status === 'completed').length,
      highPriority: allUserTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    };

    // Extract unique categories for filter dropdown
    const categories = [...new Set(allUserTasks.map(t => t.category).filter(Boolean))];

    res.render('dashboard', {
      user: req.session.user,
      tasks,
      stats,
      categories,
      query: { status: status || 'all', priority: priority || 'all', category: category || 'all', search: search || '' }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).send('Internal Server Error loading dashboard');
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.redirect('/dashboard?error=TitleIsRequired');
    }

    await taskModel.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      category: category ? category.trim() : 'General',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.session.user.id,
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Create Task Error:', error);
    res.redirect('/dashboard?error=TaskCreationFailed');
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.redirect('/dashboard');
    }

    await taskModel.findOneAndUpdate(
      { _id: taskId, user: req.session.user.id },
      { status }
    );

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Update Task Error:', error);
    res.redirect('/dashboard');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await taskModel.findOneAndDelete({
      _id: taskId,
      user: req.session.user.id,
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.redirect('/dashboard');
  }
};
