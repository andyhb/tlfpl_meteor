import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Globals = new Mongo.Collection('globals');

if (Meteor.isServer) {
    Meteor.publish(null, function globalsPublication() {
        return Globals.find();    
    });
}