import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Teams} from '../../api/teams.js';
import './transfer.html';

const playersOut = new ReactiveVar([]);
const playersOutInProgress = new ReactiveVar(false);
const playersIn = new ReactiveVar([]);
const playersInInProgress = new ReactiveVar(false);

Template.transfer.onCreated(function BodyOnCreated() {
    Meteor.subscribe('teamInfo', FlowRouter.getParam('teamId'));
    playersOut.set([]);
    playersOutInProgress.set(false);
    playersIn.set([]);
    playersInInProgress.set(false);
});

Template.transfer.helpers({
    transfer() {
        return Teams.findOne();
    },
    getCurrentPlayers() {
        if (!playersOutInProgress.get()) {
            return;
        }

        return this.Players.filter(function(player) {
            return player.Current && playersOut.get().indexOf(player.Player._id) === -1;
        });
    },
    getPlayersOut() {
        return this.Players.filter(function(player) {
            return playersOut.get().indexOf(player.Player._id) > -1;
        });
    },
    getPlayersIn() {
        // return this.Players.filter(function(player) {
        //     return playersIn.get().indexOf(player.Player._id) > -1;
        // });
    },
    getPlayersOutCount() {
        let poc = playersOut.get().length;
        return poc === 0 ? "" : poc;
    },
    getPlayersInCount() {
        let pic = playersIn.get().length;
        return pic === 0 ? "" : pic;
    },
    isPlayersInInProgress() {
        console.log(playersInInProgress.get());
        return playersInInProgress.get();
    },
    anyAction() {
        return playersOut.get().length > 0 || playersIn.get().length > 0;
    }
});

Template.transfer.events({
    'click .selectPlayerOutButton'() {
        let poip = playersOutInProgress.get();
        playersOutInProgress.set(!poip);
    },
    'click .selectPlayerInButton'() {
        let piip = playersInInProgress.get();
        playersInInProgress.set(!piip);
    },
    'click .addPlayerOut'(event) {
        let outs = playersOut.get();
        outs.push(event.target.value);
        playersOut.set(outs);
    },
    'click .removePlayerOut'(event) {
        let outs = playersOut.get();
        outs.splice(outs.indexOf(event.target.value), 1);
        playersOut.set(outs);
    },
    'click .resetTransfer'() {
        playersOut.set([]);
        playersOutInProgress.set(false);
        playersIn.set([]);
        playersInInProgress.set(false);
    }
});