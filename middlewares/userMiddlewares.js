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
                    return res.status(401).json({
                        error: info.messages ? info.messages : info.toString()
                    });
                }
            
                req.user = user
            
                return next()
            })(req, res, next)
        }
    }
    
    authorization (...role) {
        return (req, res, next) => {
            const isValidRole = role.includes(req.user.role);

            if (!req.user) {
                return res.status(401).json({
                    error: 'Debes iniciar sesión'
                })     
            }
        
            if (!isValidRole) {
                return res.status(403).json({
                    error: 'No tienes permiso para consumir este recurso'
                })
            }
        
            return next()
        }
    }
}

module.exports = UserMiddlewares;