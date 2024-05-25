/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => async (req, res, next) => {
  let { fullName } = req.body;

  //retrieve employee info from DB
  const user = await user.findOne({ fullName });
  !roles.includes(user.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
};
