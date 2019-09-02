import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import { Players } from "../../api/players.js";
import "./players.html";
import "./playerEntry.html";

const searchStringState = new ReactiveVar();
const teamToAddPlayerTo = new ReactiveVar();
const notPicked = new ReactiveVar();
const playerSearchPosition = new ReactiveVar();

Template.players.onCreated(function bodyOnCreated() {
  let self = this;
  self.subscribe("players");
  notPicked.set(false);
  playerSearchPosition.set(0);
});

Template.admin.onCreated(function bodyOnCreated() {
  Meteor.subscribe("players");
});

Template.admin.onDestroyed(function() {
  searchStringState.set();
  teamToAddPlayerTo.set();
});

Template.players.helpers({
  playerSearch() {
    return playerSearch();
  }
});

const playerSearch = function() {
  var g = Globals.findOne();

  if (g) {
    let selector = {
      SeasonId: g.SeasonId
    };

    if (notPicked.get()) {
      selector["CurrentTeamId"] = null;
    }

    let position = playerSearchPosition.get();
    if (position) {
      position = parseInt(position);

      if (position !== 0) {
        selector["Position"] = position;
      }
    }

    let searchString = searchStringState.get();
    if (searchString) {
      selector["SearchName"] = { $regex: searchString, $options: "i" };
    }

    return Players.find(selector, {
      sort: {
        TotalPoints: -1
      }
    });
  }
};

Template.players.events({
  "change #notPicked"(event) {
    notPicked.set(event.target.checked);
  },
  "change #position"(event) {
    playerSearchPosition.set(event.target.value);
  },
  "keyup #playerName"(event) {
    if (event.target.value.length > 2) {
      searchStringState.set(event.target.value);
    } else {
      searchStringState.set();
    }
  },
  "click #cancelSearch"() {
    searchStringState.set();
    Template.instance()
      .$("#playerName")
      .val("");
  },
  "submit #playerSearch"(event) {
    event.preventDefault();
  }
});

Template.admin.helpers({
  players() {
    var g = Globals.findOne();

    if (g) {
      const search = searchStringState.get();

      if (search) {
        const selector = {
          SearchName: { $regex: searchStringState.get(), $options: "i" },
          SeasonId: g.SeasonId
        };

        return Players.find(selector, {
          sort: {
            TotalPoints: -1
          }
        });
      }
    }
  },
  playerContext() {
    let context = _.clone(this);

    let teamId = teamToAddPlayerTo.get();

    if (teamId) {
      context.teamId = teamId;
    } else {
      context.teamId = Template.instance()
        .$("#teamToAddPlayerTo")
        .val();
    }

    return context;
  }
});

Template.admin.events({
  "submit .find-player"() {
    event.preventDefault();
    const target = event.target;
    const name = target.playerName.value;

    searchStringState.set(name);
  },
  "change #teamToAddPlayerTo"() {
    const target = event.target;
    const teamId = target.value;

    teamToAddPlayerTo.set(teamId);
  }
});

Template.playerEntry.helpers({
  GetPlayerProperty(propertyName) {
    let player = this.data;
    let returnVal = "";

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

    if (propertyName === "RecentPoints") {
      return !!returnVal ? returnVal : 0;
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

    if (isTeamPage() && this.canSelectPlayers) {
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
    return this.gameweek;
  },
  isPlayersPage() {
    return !this.gameweek && !isTeamPage();
  },
  showPlayerInfo() {
    return FlowRouter.current().path === "/players" || isTeamPage();
  },
  getInfoIconType(chance) {
    return getInfoIconType(chance);
  }
});

const isTeamPage = function() {
  return FlowRouter.getParam("teamId");
};

const getInfoIconType = function(chance) {
  if (chance < 0 || chance === 100) {
    return "info-circle";
  }

  if (!chance || chance === 0) {
    return "exclamation-triangle";
  }

  return "exclamation";
};

Template.playerEntry.events({
  "click .add-player-to-team"() {
    Meteor.call("teams.addPlayer", this.data.teamId, this.data._id);
  },
  "click .playerInfo"() {
    event.stopPropagation();
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
};
