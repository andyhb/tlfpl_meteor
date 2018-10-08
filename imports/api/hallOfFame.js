import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const HallOfFame = new Mongo.Collection('halloffame');

if (Meteor.isServer) {
    Meteor.publish('halloffame', function hallOfFamePublication() {
        return HallOfFame.find();
    });
}