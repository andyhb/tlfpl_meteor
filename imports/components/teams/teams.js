import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import { Tracker } from "meteor/tracker";

import { Teams } from "../../api/teams.js";
import "../../api/users.js";
import "./teamEntry.html";
import "./team.html";

import "../players/playerEntry.html";

import "../../api/lineups.js";
import { Lineups } from "../../api/lineups.js";

const playersSelected = new ReactiveVar([]);
const lineupSet = new ReactiveVar();
let formation = {};

Template.team.onCreated(function bodyOnCreated() {
  Meteor.subscribe("teamInfo", FlowRouter.getParam("teamId"));
  Meteor.subscribe("teamInfo", FlowRouter.getParam("teamToCompareId"));
  Meteor.subscribe("currentUserTeamId");
  Meteor.subscribe("userData");

  formation = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
  playersSelected.set([]);
  lineupSet.set(false);

  Tracker.autorun(() => {
    let g = Globals.findOne();

    if (g) {
      Meteor.subscribe("teamLineup", FlowRouter.getParam("teamId"));

      let lineupForTeam = Lineups.findOne({
        _id:
          g.Gameweek +
          1 +
          "/" +
          g.SeasonId +
          "/" +
          FlowRouter.getParam("teamId"),
      });

      if (lineupForTeam) {
        let selectedPlayers = lineupForTeam.Players;

        let positionsArray = lineupForTeam.Formation.split("-");
        formation[1] = 1;
        for (var i = 1; i < positionsArray.length + 1; i++) {
          formation[i + 1] = positionsArray[i - 1];
        }

        if (selectedPlayers.length > 0) {
          playersSelected.set(selectedPlayers);
          lineupSet.set(true);
        }
      }
    }
  });
});

Template.team.onDestroyed(function () {
  formation = {};
  playersSelected.set();
});

Template.admin.onCreated(function bodyOnCreated() {
  Meteor.subscribe("teams");
  Meteor.subscribe("users");
});

const getTeams = function () {
  return Teams.find(
    {
      SeasonId: "5aJvcaRacSf9rtjN",
    },
    {
      sort: {
        DraftOrder: 1,
      },
    }
  );
};

Template.admin.helpers({
  teams() {
    return getTeams();
  },
  managers() {
    return Meteor.users.find();
  },
});

Template.admin.events({
  "submit .new-team"(event) {
    event.preventDefault();

    const target = event.target;
    const Name = target.name.value;
    const ManagerId = target.manager.value;
    const DraftOrder = parseInt(target.draftOrder.value);
    const ManagerName =
      target.manager.options[target.manager.selectedIndex].text;

    var g = Globals.findOne();

    if (g) {
      let SeasonId = g.SeasonId;
      let SeasonName = g.SeasonName;
      Meteor.call("teams.insert", {
        Name,
        ManagerId,
        ManagerName,
        SeasonId,
        SeasonName,
        DraftOrder,
      });
    }

    target.name.value = "";
    target.draftOrder.value = "";
  },
});

Template.teamEntry.events({
  "click .delete"() {
    Meteor.call("teams.remove", this._id);
  },
});

Template.team.helpers({
  team() {
    if (this.compare) {
      return Teams.findOne({
        _id: FlowRouter.getParam("teamToCompareId"),
      });
    }

    return Teams.findOne({
      _id: FlowRouter.getParam("teamId"),
    });
  },
  getPlayers(current) {
    var players = [];

    if (this.Players && this.Players.length > 0) {
      this.Players.sort(sortPlayers);

      if (current) {
        players = this.Players.filter(function (player) {
          return player.Current;
        });
      } else {
        players = this.Players.filter(function (player) {
          return !player.Current;
        });
      }
    }

    return players;
  },
  playersSelected() {
    return playersSelected.get();
  },
  getFormation() {
    return getFormation();
  },
  getGameweek(next) {
    return getGameweek(next);
  },
  canSetLineup() {
    // not if in comparison view
    if (FlowRouter.current().path.indexOf("compare") > 0) {
      return false;
    }

    const nextGameweek = getGameweek(true);
    if (nextGameweek > 38) {
      return false;
    }

    const currentUser = Meteor.user();

    // not if they're not a user!
    if (!currentUser) {
      return false;
    }

    // yes if they own the team
    if (currentUser._id === this.ManagerId) {
      return true;
    }

    // yes if they are an admin
    if (isAdmin(currentUser)) {
      return true;
    }

    // no under any other circumstance
    return false;
  },
  isAdmin() {
    const currentUser = Meteor.user();

    return isAdmin(currentUser);
  },
  isLineupDisabled() {
    if (playersSelected.get().length !== 11) {
      return "disabled";
    }

    if (formation[1] !== 1) {
      return "disabled";
    }

    if (formation[2] < 3) {
      return "disabled";
    }

    if (formation[4] < 1) {
      return "disabled";
    }
  },
  lineupSet() {
    return lineupSet.get();
  },
  getSetLineupButtonClass() {
    if (playersSelected.get().length !== 11) {
      return "btn-danger";
    }

    return "btn-success";
  },
  getCurrentUserTeamId() {
    const currentUser = Meteor.user();
    const team = Teams.findOne({
      SeasonId: this.SeasonId,
      ManagerId: currentUser._id,
    });

    if (team) {
      return team._id;
    }
  },
  canCompare() {
    // not if in comparison view
    if (FlowRouter.current().path.indexOf("compare") > 0) {
      return false;
    }

    const currentUser = Meteor.user();

    // not if they're not a user!
    if (!currentUser) {
      return false;
    }

    // not if they own the team
    if (currentUser._id === this.ManagerId) {
      return false;
    }

    // otherwise true
    return true;
  },
});

const getGameweek = function (next) {
  let g = Globals.findOne();

  if (g) {
    return next ? g.Gameweek + 1 : g.Gameweek;
  }
};

const isAdmin = function (currentUser) {
  return currentUser.role && currentUser.role === "admin";
};

Template.team.events({
  "click .toggle-selection"() {
    let selected = playersSelected.get();

    if (selected.indexOf(this.data.Player._id) > -1) {
      this.data.Selected = false;
      selected.splice(selected.indexOf(this.data.Player._id), 1);
      updateFormation(false, this.data.Player.Position);
    } else {
      if (allowedToSelectPlayer(selected, this.data.Player.Position)) {
        this.data.Selected = true;
        selected.push(this.data.Player._id);
        updateFormation(true, this.data.Player.Position);
      }
    }

    playersSelected.set(selected);
  },
  "click .set-lineup"(event) {
    const target = event.target;

    let g = Globals.findOne();

    if (g) {
      let selected = playersSelected.get();
      let gameweek = g.Gameweek;

      if (target.value === "next") {
        gameweek++;
      }

      let lineup = {
        _id: gameweek + "/" + g.SeasonId + "/" + this._id,
        Gameweek: gameweek,
        SeasonId: g.SeasonId,
        TeamId: this._id,
        Players: selected,
        Formation: getFormation(),
        DateSet: new Date(),
      };

      Meteor.call("lineups.update", lineup);
    }
  },
});

const sortPlayers = function (a, b) {
  let aPosition = a.Player.Position;
  let bPosition = b.Player.Position;

  let aTotalPoints = a.Player.TotalPoints;
  let bTotalPoints = b.Player.TotalPoints;

  if (aPosition < bPosition) return -1;
  if (aPosition > bPosition) return 1;
  if (aTotalPoints > bTotalPoints) return -1;
  if (aTotalPoints < bTotalPoints) return 1;
};

const getFormation = function () {
  if (playersSelected.get().length > 0) {
    return formation[2] + "-" + formation[3] + "-" + formation[4];
  } else {
    return "";
  }
};

const updateFormation = function (add, position) {
  if (add) {
    formation[position]++;
  } else {
    formation[position]--;
  }
};

const allowedToSelectPlayer = function (selected, position) {
  if (selected.length === 11) {
    return false;
  }

  if (selected.length === 10 && formation[1] < 1) {
    return position === 1;
  }

  if (selected.length === 10 && formation[1] === 1 && formation[4] < 1) {
    return position === 4;
  }

  if (selected.length === 9 && formation[1] < 1 && formation[4] < 1) {
    if (position === 2 && formation[3] === 5) {
      return false;
    }

    if (position === 3 && formation[2] === 5) {
      return false;
    }
  }

  if (position === 1 && formation[1] < 1) {
    return true;
  }

  if (position === 2 && formation[2] < 5) {
    return true;
  }

  if (position === 3 && formation[3] < 5) {
    return true;
  }

  if (position === 4 && formation[4] < 3) {
    return true;
  }

  return false;
};
