function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'You need to be logged in to perform this action' });
    }
}