//
//Access the teams model..
//i.e.,the db table to operate.
const team = require("../../models").Teams;
const User = require("../../models").Users;
//
//Validator
const validation = require("../validation/teamsValidator");
//
//Export the controller logic...
//i.e., the dbase operations to perform on the teams entity.
module.exports = {
  //Add a team into the entity, given the incoming post data.
  //1.Check whether the team already exists, from the given name value in the post data.
  //
  //2.If none exists, create one.
  createTeam(incoming, result) {
    //Ensure validation is done before logic runs
    const { isvalid, error } = validation(incoming);
    //
    if (isvalid) {
      team.findOne({
        where: {
          name: incoming.name
        }
      }).then(found=>{
        if(found !== null){
            result({error:"TeamName already taken"},null);
        }else{
            team.create({
              //
              //Populate the entity columns with values from the incoming object.
              description: incoming.description,
              name: incoming.name,
              deliverable: incoming.deliverable,
              createdAt: Date.now(),
              createdBy: incoming.user,
            })
            .then((team) => {
              //
              //Onsuccess, return the creation result.
              result(null, {message: "Team created Successfully"});
            })
            .catch((error) => {
              //If unsuccessful, throw and alert the error message
              result(error.message, null);
            });
        }
      }).catch(err=>{result(err.message,null)})
        
    } else {
      result({ error: error }, null);
    }
  },
  /*
  *Discard an existing team
  */
  deleteTeam(id, result) {
    //
    //
    team
      .destroy(id)
      .then((done) => {
        //
        //If deletion was successful report back
        let msg;
        if (done) {
          msg = "Deletion successful.";
        } else {
          msg = "Deletion unsuccessful.";
        }
        result(null, msg);
      })
      .catch((error) => {
        //
        //If unsuccesful, report back the error message
        result(error, null);
      });
  },
  //Get all existing teams
  findTeams(result) {
    team
      .findAll({attributes:["id","name"]})
      .then((found) => {
        result(null, found);
      })
      .catch((error) => {
        result(error, null);
      });
  },
  //
  //Modify something within teams` columns e.g description
  updateTeamInfo(info, result) {
    //
    //destructure the json post data
    const { id, name, description, deliverable } = info;
    //response
    let msg;
    //
    //find the specific record to update, given the id
    team
      .findByPk(id)
      .then((found) => {
        found
          .update({
            name,
            deliverable,
            description,
          })
          .then((success) => {
            //
            if (!success) {
              msg = "Info Update failed..there`s no such team.";
            } else {
              msg = "Info Update successful.";
            }
            result(null, msg);
          })
          .catch((error) => {
            result(error.message, null);
          });
      })
      .catch((error) => {
        result(error.message, null);
      });
  }
}
