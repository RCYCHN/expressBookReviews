const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if the session exists and contains a token
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token using jwt
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        
        // If valid, add decoded data (like user info) to request
        req.user = decoded;
        
        // Proceed to next middleware
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
