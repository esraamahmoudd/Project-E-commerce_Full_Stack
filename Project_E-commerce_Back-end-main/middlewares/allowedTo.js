
const allowTo=(...roles)=>{
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Access denied. No user found.' });
        }   
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
        }
        next();
    };
}
module.exports = allowTo;
