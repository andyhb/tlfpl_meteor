import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import { Teams } from "../../api/teams.js";
import "./admin.html";

const groupName = new ReactiveVar();
const groupTeams = new ReactiveVar([]);
const numberOfRounds = new ReactiveVar();
const startingWeek = new ReactiveVar();
const skipWeek = new ReactiveVar();

Template.cupAdmin.onCreated(function bodyOnCreated() {
  const currentUser = Meteor.user();

  if (!currentUser) {
    FlowRouter.go("/");
  }

  if (currentUser && (!currentUser.role || currentUser.role !== "admin")) {
    FlowRouter.go("/");
  }

  Meteor.subscribe("teams");
  numberOfRounds.set(1);
  startingWeek.set(1);
  skipWeek.set(1);
});

const getTeams = function() {
  let g = Globals.findOne();

  if (g) {
    let selector = {
      SeasonId: g.SeasonId
    };

    return Teams.find(selector, {
      sort: {
        DraftOrder: 1
      }
    });
  }
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
  startingWeeks() {
    let weeks = [];
    for (let x = 1; x < 39; x++) {
      weeks.push(x);
    }
    return weeks;
  },
  skipWeeks() {
    let weeks = [];
    for (let x = 1; x < 11; x++) {
      weeks.push(x);
    }
    return weeks;
  },
  anyAction() {
    return groupTeams.get().length > 0 && groupName.get().length > 0;
  }
});

Template.cupAdmin.events({
  "keyup #groupName"(event) {
    groupName.set(event.target.value);
  },
  "submit #addTeamToGroup"(event) {
    event.preventDefault();

    let existingTeams = groupTeams.get();
    let teams = getTeams();

    let selectedTeam = teams.fetch().filter(function(team) {
      return team._id === event.target.teamToAdd.value;
    })[0];

    existingTeams.push(selectedTeam);
    groupTeams.set(existingTeams);
  },
  "change #numberOfRounds"(event) {
    numberOfRounds.set(event.target.value);
  },
  "change #startingWeek"(event) {
    startingWeek.set(event.target.value);
  },
  "change #skipWeek"(event) {
    skipWeek.set(event.target.value);
  },
  "click #confirmGroup"() {
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
        Order: order,
        SeasonId: g.SeasonId,
        SeasonName: g.SeasonName,
        StartingWeek: parseInt(startingWeek.get()),
        SkipWeek: parseInt(skipWeek.get())
      };

      if (groupTeams % 2 !== 0) {
        cupGroup["Bye"] = true;
      }

      Meteor.call("cupGroup.update", cupGroup);
    }
  },
  "click #resetGroup"() {
    groupName.set();
    groupTeams.set([]);
  }
});
