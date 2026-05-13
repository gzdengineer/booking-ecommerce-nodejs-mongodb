const express=require('express');
const app=express();

const bodyParser=require('body-parser');
const path=require('path');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const mongoDbStore=require('connect-mongodb-session')(session);

app.set('view engine','pug');
app.set('views','./views');

const adminRoutes=require('./routes/admin');
const userRoutes=require('./routes/shop');
const mongoose=require('mongoose');
const accountRoutes=require('./routes/account')


const errorController=require('./controllers/errors');
//const mongoConnect=require('./utility/database').mongoConnect;

const User=require('./models/user');
const ConnectionString='mongodb://localhost/booking'

var store=new mongoDbStore({
    uri:ConnectionString,
    collection:'mySessions'
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:3600000
    },
    store:store
}));

app.use(express.static(path.join(__dirname,'public')));


app.use((req,res,next)=>{

    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user._id)
    //({name:'gozdeulutas'})
        .then(user=>{
            req.user=user;
            next();
        })
        .catch(err=>{console.log(err)});
})

app.use('/admin',adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);



app.use(errorController.get404Page);
/*
mongoConnect(()=>{

    User.findByUserName('gozdeulutas')
        .then(user=>{
            if(!user){
                user=new User('gozdeulutas','email@gozde.com');
                return user.save();
            }
            return user;
        })
        .then(user=>{
            console.log(user);
            app.listen(3000);
        })
        .catch(err=>{console.log(err)});

    
})

  
*/
mongoose.connect(ConnectionString)
    .then(()=>{
        console.log('connected');
        User.findOne({name:'gozdeulutas'})
            .then(user=>{
                if(!user){

                    user=new User({
                        name:'gozdeulutas',
                        email:'email@gozde.com',
                        cart:{
                            items:[]
                        }
                    });
                    return user.save();
                }
                return user;
            })
            .then(user=>{
                console.log(user);
                app.listen(4000);
            })
            .catch(err=>{console.log(err)}); })
    .catch(err=>{
        console.log(err);
    })

    
