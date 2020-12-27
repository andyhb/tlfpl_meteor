import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import {
  CupGroupFixtures,
  CupGroupTables,
  CupKnockoutFixtures,
} from "../../api/cup.js";
import "./fixtures.html";
import "./cupGroupTable.html";
import "./cupGroupTableEntry.html";

Template.fixtures.onCreated(function bodyOnCreated() {
  Meteor.subscribe("cup_group_fixtures");
  Meteor.subscribe("cup_group_tables");
  Meteor.subscribe("cup_knockout_fixtures");
});

Template.fixtures.helpers({
  cupGroupFixtures() {
    var g = Globals.findOne();

    if (g) {
      return CupGroupFixtures.find({ SeasonId: g.SeasonId });
    }
  },
  cupKnockoutFixtures() {
    var g = Globals.findOne();

    if (g) {
      return CupKnockoutFixtures.find(
        { SeasonId: g.SeasonId },
        {
          sort: {
            RoundOrder: -1,
          },
        }
      );
    }
  },
  notBye(match) {
    return !match.Team1.Bye && !match.Team2.Bye;
  },
  getCupTableData(id) {
    var g = Globals.findOne();

    if (g) {
      const selector = {};
      var gameweek = gameweekState.get();
      globalGameweek = g.Gameweek;

      selector.SeasonId = g.SeasonId;
      selector.CupGroupId = id;

      var tables = CupGroupTables.find(selector).fetch();

      if (tables) {
        var gw = gameweek ? gameweek : globalGameweek;
        var selectedTable = tables.filter((table) => table.Gameweek === gw)[0];

        if (!selectedTable) {
          var orderedTables = tables.sort(sortTables);

          return orderedTables[0];
        }

        if (selectedTable) {
          return selectedTable;
        }
      }
    }
  },
  isGreater(fixture, team1) {
    if (team1) {
      if (fixture.Team1.Points > fixture.Team2.Points) {
        return "isGreater";
      }
    } else {
      if (fixture.Team2.Points > fixture.Team1.Points) {
        return "isGreater";
      }
    }
  },
  showPoints(points) {
    if (points) {
      return points;
    } else {
      return "";
    }
  },
});

const sortTables = function (a, b) {
  let aGameweek = a.Gameweek;
  let bGameweek = b.Gameweek;

  if (aGameweek > bGameweek) return -1;
  if (aGameweek < bGameweek) return 1;
};

const gameweekState = new ReactiveVar();
let globalGameweek = 1;
let fixtureWeeks = [];

Template.cupGroupTable.onCreated(function bodyOnCreated() {
  Meteor.subscribe("cup_group_tables");
  Meteor.subscribe("cup_group_fixtures");
});

Template.cupGroupTable.helpers({
  getGameweek() {
    if (this.data) {
      return this.data.Gameweek;
    }
  },
  showNextGameweekButton() {
    var g = Globals.findOne();

    if (this.data && g) {
      let tempCGF = CupGroupFixtures.find({
        _id: this.data.CupGroupId,
      });

      if (tempCGF) {
        tempCGF.forEach((groupFixtures) => {
          groupFixtures.Fixtures.forEach((fixture) => {
            fixtureWeeks.push(fixture.Gameweek);
          });
        });
      }

      var gameweek = this.data.Gameweek + 1;

      currIndex = fixtureWeeks.indexOf(this.data.Gameweek);
      if (currIndex >= 0 && currIndex < fixtureWeeks.length - 1) {
        gameweek = fixtureWeeks[currIndex + 1];
      }

      if (gameweek > globalGameweek || gameweek > 26) {
        return false;
      }

      return true;
    }
  },
  showPreviousGameweekButton() {
    var g = Globals.findOne();

    if (this.data && g) {
      let tempCGF = CupGroupFixtures.find({
        _id: this.data.CupGroupId,
      });

      if (tempCGF) {
        tempCGF.forEach((groupFixtures) => {
          groupFixtures.Fixtures.forEach((fixture) => {
            fixtureWeeks.push(fixture.Gameweek);
          });
        });
      }

      var gameweek = this.data.Gameweek - 1;

      currIndex = fixtureWeeks.indexOf(this.data.Gameweek);
      if (currIndex >= 0 && currIndex < fixtureWeeks.length - 1) {
        gameweek = fixtureWeeks[currIndex - 1];
      }

      if (gameweek === undefined || gameweek < this.startingWeek) {
        return false;
      }

      return true;
    }
  },
});

Template.cupGroupTable.events({
  "click [nextGameweek]"() {
    var g = Globals.findOne();

    if (this.data && g) {
      let tempCGF = CupGroupFixtures.find({
        _id: this.data.CupGroupId,
      });

      if (tempCGF) {
        tempCGF.forEach((groupFixtures) => {
          groupFixtures.Fixtures.forEach((fixture) => {
            fixtureWeeks.push(fixture.Gameweek);
          });
        });
      }

      var gameweek = this.data.Gameweek + 1;

      currIndex = fixtureWeeks.indexOf(this.data.Gameweek);
      if (currIndex >= 0 && currIndex < fixtureWeeks.length - 1) {
        gameweek = fixtureWeeks[currIndex + 1];
      }

      if (gameweek > globalGameweek) {
        gameweek = globalGameweek;
      }

      gameweekState.set(gameweek);
    }
  },
  "click [previousGameweek]"() {
    var g = Globals.findOne();

    if (this.data && g) {
      let tempCGF = CupGroupFixtures.find({
        _id: this.data.CupGroupId,
      });

      if (tempCGF) {
        tempCGF.forEach((groupFixtures) => {
          groupFixtures.Fixtures.forEach((fixture) => {
            fixtureWeeks.push(fixture.Gameweek);
          });
        });
      }

      var gameweek = this.data.Gameweek - 1;

      currIndex = fixtureWeeks.indexOf(this.data.Gameweek);
      if (currIndex >= 0 && currIndex < fixtureWeeks.length - 1) {
        gameweek = fixtureWeeks[currIndex - 1];
      }

      if (gameweek < this.startingWeek) {
        gameweek = this.startingWeek;
      }

      gameweekState.set(gameweek);
    }
  },
});

Template.cupGroupTableEntry.helpers({
  movedUp(position, previousPosition) {
    if (!previousPosition) {
      return false;
    }

    if (position < previousPosition) {
      return true;
    }

    return false;
  },
  movedDown(position, previousPosition) {
    if (!previousPosition) {
      return false;
    }

    if (position > previousPosition) {
      return true;
    }

    return false;
  },
  getPlayed() {
    return this.Win + this.Lose + this.Draw;
  },
});
