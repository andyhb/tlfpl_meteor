import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export const TeamFines = new Mongo.Collection("fines_team");
export const ManagerFines = new Mongo.Collection("fines_manager");

if (Meteor.isServer) {
  Meteor.publish("teamFines", function teamFinesPublication() {
    let g = Globals.findOne();
    if (g) {
      return TeamFines.find({ SeasonId: g.SeasonId });
    }
  });

  Meteor.publish("managerFines", function managerFinesPublication() {
    let g = Globals.findOne();
    if (g) {
      return ManagerFines.find({ SeasonId: g.SeasonId });
    }
  });
}
