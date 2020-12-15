import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Gameweeks = new Mongo.Collection("gameweek");

if (Meteor.isServer) {
  Meteor.publish("gameweek", function gameweekPublication() {
    let g = Globals.findOne();
    if (g) {
      return Gameweeks.find({ SeasonId: g.SeasonId });
    }
  });

  Meteor.publish("currentGameweek", function currentGameweekPublication() {
    let g = Globals.findOne();
    if (g) {
      return Gameweeks.find({ SeasonId: g.SeasonId, Gameweek: g.Gameweek });
    }
  });
}
