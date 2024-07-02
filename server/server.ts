import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';

import authRoutes from './routes/auth';
// import {uploadRoutes} from './routes/upload';
// import signRoutes from './routes/sign';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Import routes

// Use routes
app.use('/auth', authRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/sign', signRoutes);


// Root route
app.get('/', (req, res) => {
    res.send('Welcome to Asan Dastakhat!');
});

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});


// Middleware to check if user is authenticated
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.user) {
        return next();
    }
    res.redirect('/auth/google');
}

// Example protected route
app.get('/profile', isAuthenticated, async (req: any, res) => {
    const user = await prisma.user.findUnique({
        where: {
            email: req.user.email,
        },
    });

    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    res.send(`Hello, ${user.name}! Your email is ${user.email}.`);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
