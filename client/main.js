import '../imports/startup/accounts-config.js';
import '../imports/components/gameweeks/gameweeks.js';
import '../imports/components/teams/teams.js';
import '../imports/components/seasons/seasons.js';
import '../imports/components/table/table.js';
// import '../imports/components/todosList/todosList.js';
import '../imports/components/users/users.js';
import '../imports/components/players/players.js';
import '../imports/components/notifications/notification.js';
import '../imports/components/playerInfo/playerInfo.js';
import '../imports/components/transfer/transfer.js';
import '../imports/components/compare/compareTeams.js';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Lineups} from '../imports/api/lineups.js';
import {Teams} from '../imports/api/teams.js';

const currentUserTeam = new ReactiveVar();

Template.navigation.onCreated(function bodyOnCreated() {
    Meteor.subscribe('userData');
    Meteor.subscribe('currentUserTeamId');

    this.autorun(() => {
        const team = Teams.findOne();

        if (team) {
            currentUserTeam.set(team);
        }
    });
});

Template.navigation.helpers({
    isAdmin() {
        const currentUser = Meteor.user();

        if (!currentUser) {
            return false;
        }

        if (currentUser.role && currentUser.role === 'admin') {
            return true;
        }

        return false;
    },
    isLineup() {
        const g = Globals.findOne();
        if (currentUserTeam.get() && g) {
            Meteor.subscribe('currentUserLineup', currentUserTeam.get()._id);
            return Lineups.findOne({
                TeamId: currentUserTeam._id,
                Gameweek: g.Gameweek + 1,
                SeasonId: g.SeasonId
            });
        }
    },
    getTeamId() {
        if (currentUserTeam.get()) {
            return currentUserTeam.get()._id;
        }
    }
});

// Meteor.connection._stream.on('message', message => {
//     const data = JSON.parse(message);

//     if (data.collection === 'lineups') {
//         console.log(data);
//     }
// });