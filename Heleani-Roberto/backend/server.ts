import app from './src/app';
import env from './env';
import user_routes from './src/routes/user_routes';
import auth_routes from './src/routes/auth_routes';
import pet_routes from  './src/routes/pet_routes';
import pet_types_routes from './src/routes/pet_types_routes';
import veterinarian_routes from './src/routes/veterinarian_routes';
import veterinary_center_routes from './src/routes/veterinary_center_routes';
import comments_routes from './src/routes/comments_routes';
import appointments_routes from './src/routes/appointment_routes'

// use routes

// users routes
app.use('/api/users', user_routes);

// auth routes
app.use('/api/auth', auth_routes);

// pet routes
app.use('/api/pets', pet_routes);

// pet types routes
app.use('/api/pet-types', pet_types_routes);

// veterinarian routes
app.use('/api/veterinarians', veterinarian_routes);

// veterinary center routes
app.use('/api/centers', veterinary_center_routes);

// comments routes
app.use('/api/comments', comments_routes);

// appoitment routes
app.use('/api/appointments', appointments_routes);

app.use('/api', (req, res) =>{
    res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});