import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import {
    Box, AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent,
    Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Stack, LinearProgress
} from '@mui/material';
import { 
    Add as AddIcon, DeleteOutline, Logout, Dashboard as DashboardIcon,
    RadioButtonUnchecked, CheckCircleOutline, PlayCircleOutline
} from '@mui/icons-material';

const KanbanColumn = ({ title, tasks, status, onDelete, icon }) => (
    <Box sx={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Column Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {icon}
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                    {title}
                </Typography>
                <Chip label={tasks.length} size="small" sx={{ height: 20, bgcolor: '#27272a', color: 'text.secondary', fontSize: '0.7rem' }} />
            </Box>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <AddIcon fontSize="small" />
            </IconButton>
        </Box>
        
        {/* Task Cards */}
        <Stack spacing={1.5}>
            {tasks.map((task) => (
                <Card key={task.id} elevation={0} sx={{ 
                    bgcolor: 'background.paper', // Zinc-900
                    border: '1px solid #27272a', // Zinc-800
                    transition: 'all 0.2s', 
                    '&:hover': { borderColor: '#52525b', cursor: 'grab' } 
                }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
                                {task.title}
                            </Typography>
                            <IconButton size="small" onClick={() => onDelete(task.id)} sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: 'error.main' } }}>
                                <DeleteOutline fontSize="small" />
                            </IconButton>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {task.description || 'No description provided.'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                                label={status.replace('_', ' ')} 
                                size="small" 
                                sx={{ 
                                    height: 22, 
                                    fontSize: '0.7rem', 
                                    bgcolor: '#27272a', 
                                    color: status === 'DONE' ? '#10b981' : status === 'IN_PROGRESS' ? '#f59e0b' : 'text.secondary',
                                    border: '1px solid',
                                    borderColor: 'transparent'
                                }} 
                            />
                            {task.dueDate && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    </Box>
);

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO' });
    const navigate = useNavigate();

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [taskRes, analyticsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/analytics')
            ]);
            setTasks(taskRes.data.content);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            if (error.response?.status === 403) navigate('/');
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/tasks', newTask);
            setNewTask({ title: '', description: '', status: 'TODO' });
            setOpenDialog(false);
            fetchData();
        } catch (error) { alert('Failed to create task'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete task?")) return;
        await api.delete(`/tasks/${id}`);
        fetchData();
    };

    const todoTasks = tasks.filter(t => t.status === 'TODO');
    const progressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const doneTasks = tasks.filter(t => t.status === 'DONE');

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
            {/* Header */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #27272a', bgcolor: 'background.default' }}>
                <Toolbar variant="dense" sx={{ minHeight: 60 }}>
                    <DashboardIcon sx={{ color: 'text.primary', mr: 2, fontSize: 20 }} />
                    <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                        TaskMaster
                    </Typography>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        color="inherit" 
                        startIcon={<Logout fontSize="small" />} 
                        onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
                        sx={{ borderColor: '#27272a' }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                {/* Stats */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ p: 2, border: '1px solid #27272a', borderRadius: 2, bgcolor: 'background.paper', minWidth: 200 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>Total Tasks</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>{analytics.TOTAL_TASKS || 0}</Typography>
                    </Box>
                    <Box sx={{ p: 2, border: '1px solid #27272a', borderRadius: 2, bgcolor: 'background.paper', flexGrow: 1, maxWidth: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Progress</Typography>
                            <Typography variant="caption" sx={{ color: 'text.primary' }}>
                                {analytics.TOTAL_TASKS ? Math.round((analytics.DONE / analytics.TOTAL_TASKS) * 100) : 0}%
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={analytics.TOTAL_TASKS ? (analytics.DONE / analytics.TOTAL_TASKS) * 100 : 0} 
                            sx={{ bgcolor: '#27272a', '& .MuiLinearProgress-bar': { bgcolor: '#fafafa' } }}
                        />
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ ml: 'auto', height: 50 }}>
                        Create Task
                    </Button>
                </Box>

                {/* Kanban */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <KanbanColumn 
                            title="Backlog" status="TODO" tasks={todoTasks} onDelete={handleDelete}
                            icon={<RadioButtonUnchecked fontSize="small" sx={{ color: 'text.secondary' }} />} 
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <KanbanColumn 
                            title="In Progress" status="IN_PROGRESS" tasks={progressTasks} onDelete={handleDelete}
                            icon={<PlayCircleOutline fontSize="small" sx={{ color: '#f59e0b' }} />} 
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <KanbanColumn 
                            title="Completed" status="DONE" tasks={doneTasks} onDelete={handleDelete}
                            icon={<CheckCircleOutline fontSize="small" sx={{ color: '#10b981' }} />} 
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{ sx: { bgcolor: '#18181b', border: '1px solid #27272a', backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ color: 'text.primary', fontWeight: 600 }}>New Task</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField 
                            label="Title" fullWidth autoFocus 
                            value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                        />
                        <TextField 
                            label="Description" fullWidth multiline rows={3} 
                            value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                        />
                        <TextField 
                            select label="Status" fullWidth 
                            value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}
                        >
                            <MenuItem value="TODO">To Do</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="DONE">Done</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}