import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Teams} from '../../api/teams.js';
import {Players} from '../../api/players.js';
import '../../api/transfers.js';
import './transfer.html';

const playersOut = new ReactiveVar([]);
const playersOutInProgress = new ReactiveVar(false);
const playersIn = new ReactiveVar([]);
const playersInInProgress = new ReactiveVar(false);
const searchStringState = new ReactiveVar();
const searchResults = new ReactiveVar([]);

let teamInfoSub = null;

Template.transfer.onCreated(function BodyOnCreated() {
    teamInfoSub = Meteor.subscribe('teamInfo', FlowRouter.getParam('teamId'));
    Meteor.subscribe('players');
    playersOut.set([]);
    playersOutInProgress.set(false);
    playersIn.set([]);
    playersInInProgress.set(false);
    searchResults.set([]);
});

Template.transfer.onDestroyed(function () {
    teamInfoSub.stop();
    playersOut.set([]);
    playersOutInProgress.set(false);
    playersIn.set([]);
    playersInInProgress.set(false);
    searchResults.set([]);
    searchStringState.set();
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
        return playersIn.get();
    },
    getPlayerSearchResults() {
        const search = searchStringState.get();
    
        if (search) {
            const selector = {
                "SearchName" : {$regex : search, $options : 'i'}
            };

            let results = Players.find(selector, {
                sort: {
                    TotalPoints: -1
                }
            });

            searchResults.set(results.fetch());
            return results;
        }
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
        return playersInInProgress.get();
    },
    anyAction() {
        return playersOut.get().length > 0 || playersIn.get().length > 0;
    },
    showTeamName(player) {
        return player.CurrentTeamName !== null;
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
    'click .addPlayerIn'(event) {
        let ins = playersIn.get();
        let results = searchResults.get();

        let player = results.filter(function(searchPlayer) {
            return searchPlayer._id === event.target.value;
        })[0];

        if (ins.indexOf(player) < 0) {
            ins.push(player);
            playersIn.set(ins);
        }
    },
    'submit #playerSearchForTransfer'() {
        event.preventDefault();

        const target = event.target;
        const name = target.playerName.value;
    
        searchResults.set([]);
        searchStringState.set(name);
    },
    'click .removePlayerOut'(event) {
        let outs = playersOut.get();
        outs.splice(outs.indexOf(event.target.value), 1);
        playersOut.set(outs);
    },
    'click .removePlayerIn'(event) {
        let ins = playersIn.get();
        ins.splice(ins.indexOf(event.target.value), 1);
        playersIn.set(ins);
    },
    'click .resetTransfer'() {
        playersOut.set([]);
        playersOutInProgress.set(false);
        playersIn.set([]);
        playersInInProgress.set(false);
        searchResults.set([]);
        searchStringState.set();
    },
    'click .confirmTransfer'() {
        let g = Globals.findOne();

        if (g) {
            let transfer = {
                PlayersIn: playersIn.get().map(function(pin) {
                    return pin._id;
                }),
                PlayersOut: playersOut.get(),
                Processed: false,
                Emergency: false,
                TransferDate: new Date(),
                Gameweek: g.Gameweek
            }

            Meteor.call('transfers.update', transfer, FlowRouter.getParam('teamId'));
        }
    }
});