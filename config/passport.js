const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// module.exports = function(passport){
//     //Define strategy
//     passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) =>{
//                     try{
//                         const user = await User.findOne({email});
//                         if(!user){
//                             return done(null, false, {
//                                 message: "No user found"
//                             });
//                         }
//                     const isMatch = await bcrypt.compare(password, user.password);
//                     if(!isMatch){
//                         return done(null, false, {message: "Password incorrect"}); 
//                         }
//                     //Authentication successful
//                     return done(null, user);

//                     }catch(error){         
//                         return done(error);
//                 }
//             }
//         )
//     );
//     //serialize user
//     passport.serializeUser(function(user, done){
//         done(null, user.id);
//     });
//     passport.deserializeUser(async function(id, done){
//         try{
//             const user = await User.findById(id);
//             done(null, user);
//         }catch(error){
//             done(error, null);
//         }
//     });


// };

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) =>{
        try{
            const user = await User.findOne({email});
            if(!user){
                console.log("Debug: 找不到用户");
                return done(null, false, { message: "No user found" });
            }

            // --- 🔎 Debug 日志 (调试完记得删掉) ---
            console.log("------- DEBUG START -------");
            console.log("1. 输入的明文密码:", password);
            console.log("2. 数据库里的密码:", user.password);
            
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("3. 比对结果 (isMatch):", isMatch);
            console.log("------- DEBUG END -------");
            // -------------------------------------

            if(!isMatch){
                return done(null, false, {message: "Password incorrect"}); 
            }
            return done(null, user);

        }catch(error){         
            return done(error);
        }
    }));

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