import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Teams = new Mongo.Collection('teams');

if (Meteor.isServer) {
    Meteor.publish('teams', function teamsPublication() {
        return Teams.find();
    });

    Meteor.publish('teamInfo', function teamsPublication(teamId) {
        return Teams.find({_id: teamId}, {limit: 1});
    });

    Meteor.publish('currentUserTeamId', function teamsPublication() {
        let g = Globals.findOne();
        if (g) {
          return Teams.find({SeasonId: g.SeasonId, ManagerId: this.userId}, {_id: 1, limit: 1});
        }
    });
}

Meteor.methods({
    'teams.insert' (newTeam) {
      check(newTeam.Name, String);
   
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
   
      Teams.insert(newTeam);
    },
    'teams.remove' (teamId) {
      check(teamId, String);
      
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
   
      Teams.remove(teamId);
    },
    'teams.addPlayer' (teamId, combinedPlayerId) {

      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      const playerId = parseInt(combinedPlayerId.substr(0, combinedPlayerId.indexOf('/')));

      const team = Teams.findOne(teamId);
      const playerIdsToAdd = team.PlayerIdsToAdd || [];

      if (playerIdsToAdd.indexOf(playerId) === -1) {
        playerIdsToAdd.push(playerId);
      }

      if (playerIdsToAdd.length > 0) {
        Teams.update(teamId, {
          $set: {
            PlayerIdsToAdd: playerIdsToAdd
          }
        });
      }
    }
});