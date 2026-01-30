import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api';
import { 
    Box, Typography, TextField, Button, Paper, Alert, InputAdornment, IconButton, Container
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';

// Minimalist Centered Layout
const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'background.default',
        }}>
            <Container maxWidth="xs">
                <Paper elevation={0} sx={{ 
                    p: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: 2,
                    bgcolor: 'background.default', // Blend with background
                    border: '1px solid #27272a',   // Subtle border only
                }}>
                    <Box sx={{ width: '100%', textAlign: 'left', mb: 3 }}>
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                            TaskMaster.
                        </Typography>
                        <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    </Box>
                    {children}
                </Paper>
            </Container>
        </Box>
    );
};

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <AuthLayout title="Log in" subtitle="Enter your credentials to access your account.">
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                <TextField
                    margin="normal" required fullWidth label="Username" placeholder="johndoe"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="normal" required fullWidth label="Password" type={showPassword ? 'text' : 'password'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                            No account? <span style={{ textDecoration: 'underline' }}>Sign up</span>
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
}

export function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'USER' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Account created! Please login.');
            navigate('/');
        } catch (err) {
            setError('Registration failed. Username or Email likely taken.');
        }
    };

    return (
        <AuthLayout title="Create an account" subtitle="Enter your information to get started.">
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                    margin="normal" required fullWidth label="Username" placeholder="johndoe"
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="normal" required fullWidth label="Email" type="email" placeholder="john@example.com"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="normal" required fullWidth label="Password" type="password"
                    helperText="Minimum 6 characters"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                />
                <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
                    Create Account
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                            Already have an account? <span style={{ textDecoration: 'underline' }}>Log in</span>
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
}