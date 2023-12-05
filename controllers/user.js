const User = require('../models/user')

module.exports.registerForm = (req,res)=>{
    res.render('users/register')
}
module.exports.registerDone = async(req,res)=>{
    try{
        const {email , username ,password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        console.log(registeredUser);
        req.flash('success','the user is registered')
        res.redirect('/campgrounds')
    }
    catch(e){
        req.flash('The username already exists')
        res.redirect('register')
    }
    
}

module.exports.loginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.passportForm =  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}

module.exports.logoutOption= (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}