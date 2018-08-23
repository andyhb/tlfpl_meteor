import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Players} from '../../api/players.js';
import './players.html';
import './playerEntry.html';

const searchStringState = new ReactiveVar();
const teamToAddPlayerTo = new ReactiveVar();

Template.home.onCreated(function bodyOnCreated() {
  Meteor.subscribe('players');
});

Template.admin.onCreated(function bodyOnCreated() {
  Meteor.subscribe('players');
});

Template.admin.onDestroyed(function() {
  searchStringState.set();
  teamToAddPlayerTo.set();
});

Template.home.helpers({
  players() {
    return Players.find({}, {
      sort: {
        TotalPoints: -1
      },
      limit: 10
    });
  }
});

Template.admin.helpers({
  players() {
    const search = searchStringState.get();

    if (search) {
      const selector = {
        "SearchName" : {$regex : searchStringState.get(), $options : 'i'}
      };

      return Players.find(selector, {
        sort: {
          TotalPoints: -1
        }
      });
    }
  },
  playerContext() {
    let context = _.clone(this);

    let teamId = teamToAddPlayerTo.get();

    if (teamId) {
      context.teamId = teamId;
    } else {
      context.teamId = Template.instance().$("#teamToAddPlayerTo").val();
    }

    return context;
  }
});

Template.admin.events({
  'submit .find-player'() {
    event.preventDefault();
    const target = event.target;
    const name = target.playerName.value;

    searchStringState.set(name);
  },
  'change #teamToAddPlayerTo'() {
    const target = event.target;
    const teamId = target.value;

    teamToAddPlayerTo.set(teamId);
  }
});

Template.playerEntry.helpers({
  GetPlayerProperty(propertyName) {
    let player = this.data;
    let returnVal = '';

    if (player[propertyName]) {
      returnVal = player[propertyName];
    } else {
      if (this.data.Player) {
        player = this.data.Player;
      }

      if (player[propertyName]) {
        returnVal = player[propertyName];
      }
    }

    if (propertyName === "Position") {
      return getPosition(returnVal);
    }

    if (propertyName === "PointsForTeam") {
      if (isTeamPage()) {
        return this.data.TotalPointsScoredForTeam;
      }
    }

    if (propertyName === "TotalPoints") {
      if (isTeamPage()) {
        return this.data.Player.TotalPoints;
      }
    }

    if (propertyName === "Name") {
      let fullName = player.Forename + " " + player.Surname;
      if (fullName !== player.WebName) {
        returnVal = player.WebName;
      } else {
        returnVal = fullName;
      }
    }

    return returnVal;
  },
  getClass() {
    if (this.data.teamId) {
      return "add-player-to-team";
    }

    if (isTeamPage()) {
      return "toggle-selection";
    }
  },
  isSelected() {
    if (this.selected && this.selected.length > 0) {
      if (this.selected.indexOf(this.data.Player._id) > -1) {
        return "selected";
      }
    }
  },
  isTeamPage() {
    return isTeamPage();
  },
  isGameweek() {
    return this.context !== "gameweek";
  }
});

const isTeamPage = function() {
  return FlowRouter.getParam('teamId');
};

Template.playerEntry.events({
  'click .add-player-to-team' () {
    Meteor.call('teams.addPlayer', this.data.teamId, this.data._id);
  }
});

const getPosition = function(position) {
  if (position === 1) {
    return "GK";
  }

  if (position === 2) {
    return "DEF";
  }

  if (position === 3) {
    return "MID";
  }

  if (position === 4) {
    return "FOR";
  }
}