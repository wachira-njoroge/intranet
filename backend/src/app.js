// Importing packages
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Ensble CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS, DELETE, PUT,PATCH"
    );
    next();
});
// Link body parser for url reading
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "10gb",
    })
);
app.use(
    bodyParser.json({
        limit: "10gb",
    })
);
//
//Use the validator
//app.use(expressValidator());
// Initialize passport for authenticated routes
// app.use(passport.initialize());

// Import routes
const {
    users,
    tasks,
    teams,
    projects,
    departments,
    roles,
    privileges,
    permissions,
    resources
} = require("./routes");
//const { check } = require("express-validator");

// Initialize routes
app.use("/users", users);
app.use("/tasks", tasks);
app.use("/teams",teams);
app.use("/projects", projects);
app.use("/departments", departments);
app.use("/roles", roles);
app.use("/privileges", privileges);
app.use("/permissions", permissions);
app.use("/resources", resources);

module.exports = app;