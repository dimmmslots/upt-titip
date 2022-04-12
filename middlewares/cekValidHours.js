const checkValidHours = (req, res, next) => {
    let sessionID = req.params.id;
    let hours = sessionID.split("-")[1];
    console.log("sessionHours: " + hours);
    if(hours <= 24) {
        next();
    } else {
        res.render("closed-session",{
            sessionID,
            hours
        });
    }
};

module.exports = checkValidHours;