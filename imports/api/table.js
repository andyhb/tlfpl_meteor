import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Table = new Mongo.Collection("table");

if (Meteor.isServer) {
  Meteor.publish("table", function tablePublication() {
    let g = Globals.findOne();
    if (g) {
      return Table.find({ SeasonId: g.SeasonId });
    }
  });

  Meteor.publish("currentTable", function currentTablePublication() {
    let g = Globals.findOne();
    if (g) {
      return Table.find({ SeasonId: g.SeasonId, Gameweek: g.Gameweek });
    }
  });
}
