const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf')


const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const accountRoutes = require('./routes/account');
const errorController = require('./controllers/errors');
const User = require('./models/user');

const ConnectionString = 'mongodb://localhost/booking';

const store = new mongoDbStore({
    uri: ConnectionString,
    collection: 'mySessions'
});

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
            next();
        });
});

app.use(csurf());

app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);
app.use(errorController.get404Page);

// ===> MongoDB bağlantısı ve varsayılan kullanıcı oluşturma
mongoose.connect(ConnectionString)
    .then(() => {
        console.log('connected');

        return User.findOne({ name: 'gozdeulutas' });
    })
    .then(user => {
        if (!user) {
            const newUser = new User({
                name: 'gozdeulutas',
                email: 'email@gozde.com',
                password: '123456', // <-- ZORUNLU ALAN
                cart: {
                    items: []
                }
            });
            return newUser.save();
        }
        return user;
    })
    .then(user => {
        console.log(user);
        app.listen(4000, () => {
            console.log('Server is running on http://localhost:4000');
        });
    })
    .catch(err => {
        console.log('Connection or User Creation Error:', err);
    });
