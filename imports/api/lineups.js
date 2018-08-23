import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Lineups = new Mongo.Collection('lineups');

if (Meteor.isServer) {
    Meteor.publish('lineups', function lineupsPublication() {
        return Lineups.find();
    });
}

Meteor.methods({
    'lineups.update' (lineup) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        const existingLineup = Lineups.findOne(lineup._id);

        if (existingLineup) {
            Lineups.update(lineup._id, lineup);
        } else {
            Lineups.insert(lineup);
        }
    }
});