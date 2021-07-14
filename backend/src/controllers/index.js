const UsersController = require("./UsersController");
const TasksController = require("./TasksController");
const ProjectsController = require("./ProjectsController");
const PermissionController = require("./PermissionsController");
const ResourceController = require("./ResourcesController");
//
//Import the teamsController
const TeamsController = require("./TeamsController");
//
//Export available controllers.
module.exports = {
  UsersController,
  TasksController,
  TeamsController,
  ProjectsController,
  PermissionController,
  ResourceController
};
