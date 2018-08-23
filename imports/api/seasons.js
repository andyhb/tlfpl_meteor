import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Seasons = new Mongo.Collection('seasons');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('seasons', function seasonsPublication() {
        return Seasons.find();
    });
}

Meteor.methods({
    'seasons.insert' (name) {
      check(name, String);
   
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
   
      Seasons.insert({
        name,
        current: false
      });
    },
    'seasons.remove' (seasonId) {
      check(seasonId, String);
      
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
   
      Seasons.remove(seasonId);
    },
    'seasons.current' (seasonId) {
      check(seasonId, String);

      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      const currentSeason = Seasons.findOne({
        current: true
      });

      if (currentSeason) {
        Seasons.update(currentSeason._id, {
          $set: {
            current: false
          }
        });
      }

      Seasons.update(seasonId, {
        $set: {
          current: true
        }
      });
    }
  });