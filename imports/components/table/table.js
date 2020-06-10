import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import { Table } from "../../api/table.js";
import "./table.html";
import "./tableEntry.html";

const gameweekState = new ReactiveVar();
let globalGameweek = 1;

Template.home.onCreated(function bodyOnCreated() {
  let self = this;
  self.subscribe("table");
});

Template.home.onDestroyed(function () {
  gameweekState.set();
});

Template.home.helpers({
  getData() {
    var g = Globals.findOne();

    if (g) {
      var gameweek = gameweekState.get();
      globalGameweek = g.Gameweek;

      return Table.findOne({
        _id:
          (gameweek ? gameweek : globalGameweek === 0 ? 1 : globalGameweek) +
          "/" +
          g.SeasonId,
      });
    }
  },
});

Template.table.helpers({
  showNextGameweekButton() {
    var gameweek = this.data.Gameweek + 1;

    if (gameweek > globalGameweek) {
      return false;
    }

    return true;
  },
  showPreviousGameweekButton() {
    var gameweek = this.data.Gameweek - 1;

    if (gameweek < 1) {
      return false;
    }

    return true;
  },
});

const lastPreCovidGameweek = 29;
const firstPostCovidGameweek = 38;

const isCovidGameweek = function (gw) {
  const covidGameweeks = [30, 31, 32, 33, 34, 35, 36, 37, 38];
  if (covidGameweeks.indexOf(gw) > -1) {
    return true;
  }

  return false;
};

Template.table.events({
  "click [nextGameweek]"() {
    var gameweek = this.data.Gameweek + 1;

    if (gameweek > globalGameweek) {
      gameweek = globalGameweek;
    }

    if (isCovidGameweek(gameweek)) {
      gameweek = firstPostCovidGameweek;
    }

    gameweekState.set(gameweek);
  },
  "click [previousGameweek]"() {
    var gameweek = this.data.Gameweek - 1;

    if (gameweek < 1) {
      gameweek = 1;
    }

    if (isCovidGameweek(gameweek)) {
      gameweek = lastPreCovidGameweek;
    }

    gameweekState.set(gameweek);
  },
});

Template.tableEntry.helpers({
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
  showPointsBehind(pointsBehind) {
    if (pointsBehind === 0) {
      return false;
    }

    return true;
  },
  hasPenalty() {
    if (this.Penalty) {
      return "text-danger";
    }

    return "";
  },
});
