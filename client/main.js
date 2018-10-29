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
import '../imports/components/users/login.js';
import '../imports/components/users/logout.js';
import '../imports/components/profile/profile.js';
import '../imports/components/cup/admin.js';
import '../imports/components/cup/fixtures.js';
import '../imports/components/cup/cupFixtures.js';
import '../imports/components/chart/chart.js';
import '../imports/components/hallOfFame/hallOfFame.js';
import '../imports/components/events/admin.js';
import '../imports/components/events/events.js';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Lineups} from '../imports/api/lineups.js';
import {Teams} from '../imports/api/teams.js';

const currentUserTeam = new ReactiveVar();
const lineupSet = new ReactiveVar(false);

Template.navigation.onCreated(function bodyOnCreated() {
    Meteor.subscribe('userData');
    Meteor.subscribe('currentUserTeamId');

    this.autorun(() => {
        const team = Teams.findOne();

        if (team) {
            currentUserTeam.set(team);

            const g = Globals.findOne();
            if (g) {
                Meteor.subscribe('teamLineup', team._id);
                lineupSet.set(Lineups.findOne({
                    TeamId: team._id,
                    Gameweek: g.Gameweek + 1,
                    SeasonId: g.SeasonId
                }));
            }
        } else {
            lineupSet.set(false);
        }
    });
});

Template.navigation.onDestroyed(function () {
    currentUserTeam.set();
    lineupSet.set(false);
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
    isEventAdmin() {
        const currentUser = Meteor.user();

        if (!currentUser) {
            return false;
        }

        if (currentUser.role && currentUser.role.indexOf('admin') > -1) {
            return true;
        }

        return false;
    },
    isLineup() {
        return lineupSet.get();
    },
    getTeamId() {
        if (currentUserTeam.get()) {
            return currentUserTeam.get()._id;
        }
    }
});

// Meteor.connection._stream.on('message', message => {
//     const data = JSON.parse(message);

//     if (data.collection === 'teams') {
//         console.log(data);
//     }
// });