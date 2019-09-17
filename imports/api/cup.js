import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const CupGroups = new Mongo.Collection("cup_groups");
export const CupGroupFixtures = new Mongo.Collection("cup_group_fixtures");
export const CupGroupTables = new Mongo.Collection("cup_tables");
export const CupKnockoutFixtures = new Mongo.Collection(
  "cup_knockout_fixtures"
);

if (Meteor.isServer) {
  Meteor.publish("cup_groups", function cupGroupsPublication() {
    return CupGroups.find();
  });

  Meteor.publish("cup_group_fixtures", function cupGroupFixturesPublication() {
    return CupGroupFixtures.find();
  });

  Meteor.publish("cup_group_tables", function cupGroupTablesPublication() {
    return CupGroupTables.find();
  });

  Meteor.publish(
    "cup_knockout_fixtures",
    function cupKnockoutFixturesPublication() {
      return CupKnockoutFixtures.find();
    }
  );
}

Meteor.methods({
  "cupGroup.update"(cupGroup) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    const existingGroup = CupGroups.findOne({
      SeasonId: cupGroup.SeasonId,
      Name: cupGroup.Name
    });

    if (existingGroup) {
      CupGroups.update(existingGroup._id, cupGroup);
    } else {
      CupGroups.insert(cupGroup);
    }
  }
});
