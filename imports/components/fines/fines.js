import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import { TeamFines, ManagerFines } from "../../api/fines.js";
import "./fines.html";
import "./finesEntry.html";
import "./managerFinesEntry.html";

const gameweekState = new ReactiveVar();
const gameweekTotal = new ReactiveVar();
const managerFinesTotal = new ReactiveVar();
const managerPaidTotal = new ReactiveVar();
let globalGameweek = 1;

Template.fines.onCreated(function bodyOnCreated() {
  let self = this;
  self.subscribe("teamFines");
  self.subscribe("managerFines");
});

Template.fines.onDestroyed(function() {
  gameweekState.set();
  gameweekTotal.set();
});

Template.fines.helpers({
  fines() {
    var g = Globals.findOne();

    if (g) {
      var gameweek = gameweekState.get();
      globalGameweek = g.Gameweek;

      let actualGameweek = gameweek
        ? gameweek
        : globalGameweek === 0
        ? 1
        : globalGameweek;

      gameweekState.set(actualGameweek);

      const fines = TeamFines.find(
        {
          Gameweek: actualGameweek
        },
        {
          sort: {
            Fines: -1,
            TeamName: 1
          }
        }
      );

      let totalForGameweek = 0;
      fines.forEach(gwf => {
        totalForGameweek += gwf.Fines;
      });
      gameweekTotal.set(totalForGameweek);

      return fines;
    }
  },
  managerFines() {
    var g = Globals.findOne();

    if (g) {
      const managerFines = ManagerFines.find(
        {},
        {
          sort: {
            TotalFines: -1,
            TotalPaid: 1,
            Name: 1
          }
        }
      );

      let totalFines = 0;
      let totalPaid = 0;
      managerFines.forEach(mf => {
        totalFines += mf.TotalFines;
        totalPaid += mf.TotalPaid;
      });
      managerFinesTotal.set(totalFines);
      managerPaidTotal.set(totalPaid);

      return managerFines;
    }
  },
  showNextGameweekButton() {
    var gameweek = gameweekState.get() + 1;

    if (gameweek > globalGameweek) {
      return false;
    }

    return true;
  },
  showPreviousGameweekButton() {
    var gameweek = gameweekState.get() - 1;

    if (gameweek < 1) {
      return false;
    }

    return true;
  },
  getGameweek() {
    return gameweekState.get();
  },
  getTotalFines() {
    return formatCurrency(gameweekTotal.get());
  },
  getTotalManagerFines() {
    return formatCurrency(managerFinesTotal.get());
  },
  getTotalManagerPaid() {
    return formatCurrency(managerPaidTotal.get());
  }
});

Template.fines.events({
  "click [nextGameweek]"() {
    var gameweek = gameweekState.get() + 1;

    if (gameweek > globalGameweek) {
      gameweek = globalGameweek;
    }

    gameweekState.set(gameweek);
  },
  "click [previousGameweek]"() {
    var gameweek = gameweekState.get() - 1;

    if (gameweek < 1) {
      gameweek = 1;
    }

    gameweekState.set(gameweek);
  }
});

Template.finesEntry.helpers({
  getCurrency(fine) {
    return formatCurrency(fine);
  }
});

Template.managerFinesEntry.helpers({
  getCurrency(fine) {
    return formatCurrency(fine);
  }
});

const formatCurrency = fine => {
  return "£" + (+fine).toFixed(2);
};
