/**
 * @DESC Verify JWT from authorization header Middleware
 */
const userAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(process.env.APP_SECRET);
  if (!authHeader) return res.sendStatus(403);
  console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    console.log("verifying");
    if (err) return res.sendStatus(403); //invalid token

    console.log(decoded); //for correct token
    next();
  });
};
