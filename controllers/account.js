const User=require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin=(req,res,next)=>{
    res.render('account/login',{
        path:'/login',
        title:'Login',
        isAuthenticated:req.session.isAuthenticated,

    });
}
    
exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password);
        })
        .then(isSuccess => {
            if (isSuccess) {
                req.session.user = User;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).send('An error occurred');
                    }
                    /*var url=req.session.redirectTo||'/';
                    delete req.session.redirectTo;
                    return res.redirect('url');*/
                    res.redirect('/');
                });
            } else {
                res.redirect('/login');
            }
        })
        .catch(err => {
            console.error('Error during login process:', err);
            res.status(500).send('An error occurred');
        });
};

  /*  User.findOne({email:email})
        .then(user=>{
            if(!user){
                return res.redirect('/login');
            }
            bcrypt.compare(password,user.password)
                .then(isSuccess=>{
                    if(isSuccess){
                        req.session.user=user;
                        req.session.isAuthenticated=true;
                        return req.session.save(function(err){
                            //session saved
                            var url=req.session.redirectTo||'/';
                            delete req.session.redirectTo;
                            return res.redirect('url');
                        });
                    } 
                    res.redirect('/login');
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=> console.log(err));
        

    /*if((email=='email@gozde.com')&& (password=='1234'))
    {
        //req.isAuthenticated=true;
        //res.cookie('isAuthenticated', true);
        //cookies
        req.session.isAuthenticated=true;
        res.redirect('/');
    }else{
        req.isAuthenticated=false;   
        res.redirect('/login');
    }*/



exports.getRegister=(req,res,next)=>{
    res.render('account/register',{
        path:'/register',
        title:'Register',
        isAuthenticated:req.session.isAuthenticated
    });
}

exports.postRegister=(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email:email})
        .then(user=>{
            if(user){
                return res.redirect('/register');
            }

            return bcrypt.hash(password, 10);


        })
        .then(hashedPassword=>{
            console.log(hashedPassword);

            const newUser=new User({
                name:name,
                email:email,
                password:hashedPassword,
                cart:{items: []}
            });
            return newUser.save()
        })
        .then(()=>{
            res.redirect('/login');
        }).catch(err=>{
            console.log(err);
        })
}

exports.getReset=(req,res,next)=>{
    res.render('account/reset',{
        path:'/reset',
        title:'Reset'
    });
}
    
exports.postReset=(req,res,next)=>{
    res.redirect('/login');
}

exports.getLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    });
}


    //const email=req.body.email;
    //const password=req.body.password;
    
    //if((email=='email@gozde.com')&& (password=='1234'))
    //     {
    //         //req.isAuthenticated=true;
    //         //res.cookie('isAuthenticated', true);
    //         //cookies
    //         req.session.isAuthenticated=true;
    //         res.redirect('/');
    //     }else{
    //         req.isAuthenticated=false;   
    //         res.redirect('/login');
    //     }
    // }
    
    // exports.getRegister=(req,res,next)=>{
    //     res.render('account/register',{
    //         path:'/register',
    //         title:'Register'
    
    //     });
    // }
    
    // exports.postRegister=(req,res,next)=>{
    //     res.redirect('/login');
    // }
    
    
    // exports.getReset=(req,res,next)=>{
    //     res.render('account/reset',{
    //         path:'/reset',
    //         title:'Reset'
    
    //     });
    // }
    
    // exports.postReset=(req,res,next)=>{
    //     res.redirect('/login');
    // }
    