const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = function(passport){
    //Define strategy
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) =>{
                    try{
                        const user = await User.findOne({email});
                        if(!user){
                            return done(null, false, {
                                message: "No user found"
                            });
                        }
                    const isMatch = await bcrypt.compare(password, user.password);
                    if(!isMatch){
                        return done(null, false, {message: "Password incorrect"}); 
                        }
                    //Authentication successful
                    return done(null, user);

                    }catch(error){         
                        return done(error);
                }
            }
        )
    );
    //serialize user
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(async function(id, done){
        try{
            const user = await User.findById(id);
            done(null, user);
        }catch(error){
            done(error, null);
        }
    });


};

