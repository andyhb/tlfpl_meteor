import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Gameweeks = new Mongo.Collection('gameweek');

if (Meteor.isServer) {
    Meteor.publish('gameweek', function gameweekPublication() {
        return Gameweeks.find();
    });
}