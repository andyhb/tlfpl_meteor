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

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.navigation.onCreated(function bodyOnCreated() {
    Meteor.subscribe('userData');
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
    }
});

// Meteor.connection._stream.on('message', message => {
//     const data = JSON.parse(message);

//     if (data.collection === 'players' && data.id === '88/EXjuGdW2FpD3b5hWj') {
//         console.log(data);
//     }
// });