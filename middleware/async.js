// Returns a reference to a function. Almost like a factory function.
// Use this approach if package 'express-async-errors' package is not allowed
// each handler would get wrapped in this
function asyncMiddleware(handler){
    return async (req, res, next ) => {
        try{
            await handler(req, res);
        }
        catch(ex){
            next(ex);
        }
    };
}

module.exports = asyncMiddleware;