const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const path = require('path'); // path modülünü dahil edin

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const sessionSecret = process.env.SESSION_SECRET || 'gizli-anahtar';

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, { id: id });
});

passport.use(new GoogleStrategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('Google Profile:', profile);
        return done(null, profile);
    }
));

passport.use(new DiscordStrategy({
        clientID: discordClientId,
        clientSecret: discordClientSecret,
        callbackURL: "/auth/discord/callback",
        scope: ['identify', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('Discord Profile:', profile);
        return done(null, profile);
    }
));

app.use(express.json());

// Ana giriş sayfası
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'giris.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Giriş isteği:', email, password);
    if (email === 'test@example.com' && password === '12345') {
        req.login({ id: 'testuser' }, (err) => {
            if (err) { return next(err); }
            return res.json({ message: 'Giriş başarılı!' });
        });
    } else {
        res.status(401).json({ message: 'Giriş başarısız. E-posta veya şifre hatalı.' });
    }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda dinliyor`);
});