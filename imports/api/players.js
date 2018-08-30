import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Players = new Mongo.Collection('players');

if (Meteor.isServer) {
    Meteor.publish('players', function playersPublication() {
        return Players.find();
    });

    Meteor.publish('playerInfo', function playersPublication(playerId) {
        return Players.find({_id: playerId}, {limit: 1});
    });
}