const users = require("./users");
const tasks = require('./tasks');
const teams = require("./teams");
const departments = require("./departments");
const projects = require("./projects");
const roles = require("./roles");
const privileges = require("./privileges");
const resources = require("./resources");
const permissions = require("./permissions");

module.exports = {
    users,
    tasks,
    teams,
    projects,
    departments,
    roles,
    privileges,
    resources,
    permissions
}
