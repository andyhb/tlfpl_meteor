import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const TeamTransfers = new Mongo.Collection('team_transfers');

if (Meteor.isServer) {
    Meteor.publish('team_transfers', function transfersPublication() {
        return TeamTransfers.find();
    });
}

Meteor.methods({
    'transfers.update' (transfer, teamId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        let g = Globals.findOne();

        if (g) {
            let existingTeamTransfer = TeamTransfers.findOne({_id: g.SeasonId + "/" + teamId});

            if (existingTeamTransfer) {
                existingTeamTransfer.Transfers.push(transfer);
                TeamTransfers.update(existingTeamTransfer._id, existingTeamTransfer);
            }
        }
    }
});