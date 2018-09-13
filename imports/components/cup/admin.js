import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Teams} from '../../api/teams.js';
import './admin.html';

const groupName = new ReactiveVar();
const groupTeams = new ReactiveVar([]);
const numberOfRounds = new ReactiveVar();

Template.cupAdmin.onCreated(function bodyOnCreated() {
    const currentUser = Meteor.user();

    if (!currentUser) {
        FlowRouter.go("/");
    }

    if (currentUser && (!currentUser.role || currentUser.role !== 'admin')) {
        FlowRouter.go("/");
    }

    Meteor.subscribe("teams");
    numberOfRounds.set(1);
});

const getTeams = function() {
    return Teams.find({}, {
        sort: {
        DraftOrder: 1
        }
    });
};

Template.cupAdmin.helpers({
    teams() {
        return getTeams();
    },
    groupName() {
        return groupName.get();
    },
    numberOfTeamsInGroup() {
        return groupTeams.get().length;
    },
    groupTeams() {
        return groupTeams.get();
    },
    anyAction() {
        return groupTeams.get().length > 0 && groupName.get().length > 0;
    }
});

Template.cupAdmin.events({
    'keyup #groupName' (event) {
        groupName.set(event.target.value);
    },
    'submit #addTeamToGroup' (event) {
        event.preventDefault();

        let existingTeams = groupTeams.get();
        let teams = getTeams();

        let selectedTeam = teams.fetch().filter(function (team) {
            return team._id === event.target.teamToAdd.value;
        })[0];

        existingTeams.push(selectedTeam);
        groupTeams.set(existingTeams);
    },
    'change #numberOfRounds' (event) {
        numberOfRounds.set(event.target.value);
    },
    'click #confirmGroup' () {
        var g = Globals.findOne();

        if (g) {
            var order = groupTeams.get().map(function(team, position) {
                return {
                    Position: position + 1,
                    TeamId: team._id,
                    TeamName: team.Name
                };
            });

            let cupGroup = {
                Name: groupName.get(),
                Processed: false,
                NumberOfRounds: parseInt(numberOfRounds.get()),
                Order: order
            };

            if (groupTeams % 2 !== 0) {
                cupGroup["Bye"] = true;
            }

            Meteor.call('cupGroup.update', cupGroup);
        }
    },
    'click #resetGroup' () {
        groupName.set();
        groupTeams.set([]);
    }
});