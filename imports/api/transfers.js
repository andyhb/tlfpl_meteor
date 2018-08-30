import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Transfers = new Mongo.Collection('transfers');

if (Meteor.isServer) {
    Meteor.publish('transfers', function transfersPublication() {
        return Transfers.find();
    });
}

Meteor.methods({
    'transfers.update' (transfer) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        // const existingLineup = Lineups.findOne(lineup._id);

        // if (existingLineup) {
        //     Lineups.update(lineup._id, lineup);
        // } else {
        //     Lineups.insert(lineup);
        // }
    }
});