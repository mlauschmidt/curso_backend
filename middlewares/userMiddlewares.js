const passport = require('passport');

class UserMiddlewares {
    constructor () {

    }

    authentication (strategy) {
        return async (req, res, next) => {
            await passport.authenticate(strategy.strategy, strategy.options, (err, user, info) => {
                if (err) {
                    return next(err)
                }
            
                if (!user) {
                    /* return res.status(401).json({
                        error: info.message ? info.message : info.toString()
                    }); */

                    console.log(`Error: ${info.message}.`);
                    return next()
                }
                
                /* console.log({middleware: user}); */
                req.user = user
                return next()
            })(req, res, next)
        }
    }
    
    authorization (...role) {
        return (req, res, next) => {
            if (!req.user) {
                /* return res.status(401).json({
                    error: 'Debes iniciar sesión'
                }) */     

                console.log(`Error: Debes iniciar sesión.`);
                return next()
            }
            
            const isValidRole = role.includes(req.user.role);

            if (!isValidRole) {
                /* return res.status(403).json({
                    error: 'No tienes permiso para consumir este recurso'
                }) */

                console.log(`Error: No tienes permiso para consumir este recurso.`);
                return next()
            }
        
            return next()
        }
    }

    /* session () {
        return (req, res, next) => {
            console.log(req.user);
            if (req.user) {
                return res.redirect(`/home/${req.user.id}`);
            }
        
            return next();
        }
    }   */  
}

module.exports = UserMiddlewares;