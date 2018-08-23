import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Table = new Mongo.Collection('table');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('table', function tablePublication() {
        return Table.find();
    });
}