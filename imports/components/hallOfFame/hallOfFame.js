import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import { HallOfFame } from "../../api/hallOfFame.js";
import "./hallOfFame.html";

Template.hallOfFame.onCreated(function bodyOnCreated() {
  Meteor.subscribe("halloffame");
});

Template.hallOfFame.helpers({
  getLeagueResults() {
    let hallOfFame = HallOfFame.findOne();

    if (hallOfFame) {
      return hallOfFame.LeagueResults.sort(sortLeagueResults);
    }
  },
  getPosition(index) {
    return index + 1;
  },
  getCupResults() {
    let hallOfFame = HallOfFame.findOne();

    if (hallOfFame) {
      return hallOfFame.CupResults.sort(sortCupResults);
    }
  },
  getTrophies(count) {
    return Array.from(Array(count));
  },
  getLeagueSeasons() {
    let hallOfFame = HallOfFame.findOne();

    const seasons = [];
    if (hallOfFame) {
      hallOfFame.LeagueResults[0].SeasonStandings.forEach(ss => {
        seasons.push(ss.SeasonName);
      });
    }
    return seasons.reverse();
  },
  getCupSeasons() {
    let hallOfFame = HallOfFame.findOne();

    const seasons = [];
    if (hallOfFame) {
      hallOfFame.CupResults[0].SeasonStandings.forEach(ss => {
        seasons.push(ss.SeasonName);
      });
    }
    return seasons.reverse();
  },
  getLeaguePosition(season, leagueResults) {
    if (leagueResults) {
      const slr = leagueResults.filter(lr => {
        return lr.SeasonName === season;
      })[0];

      if (slr) {
        if (slr.Position === 1) {
          return `<span class="fa fa-trophy winner"></span>`;
        }

        if (slr.Position === 2) {
          return `<span class="fa fa-trophy runnerUp"></span>`;
        }

        return slr.Position;
      }
    }

    return "-";
  },
  getCupPosition(season, leagueResults) {
    if (leagueResults) {
      const slr = leagueResults.filter(lr => {
        return lr.SeasonName === season;
      })[0];

      if (slr) {
        if (slr.Position === 1) {
          return `<span class="fa fa-trophy winner"></span>`;
        }

        if (slr.Position === 2) {
          return `<span class="fa fa-trophy runnerUp"></span>`;
        }

        if (slr.Position === 3) {
          return `S`;
        }

        if (slr.Position === 4) {
          return `WC`;
        }

        if (slr.Position === 5) {
          return `G`;
        }

        return slr.Position;
      }
    }

    return "-";
  }
});

const sortLeagueResults = function(a, b) {
  let aTotalPoints = a.TotalPoints;
  let bTotalPoints = b.TotalPoints;

  let aHOFPoints = a.HallOfFamePoints;
  let bHOFPoints = b.HallOfFamePoints;

  if (aHOFPoints > bHOFPoints) return -1;
  if (aHOFPoints < bHOFPoints) return 1;
  if (aTotalPoints < bTotalPoints) return 1;
  if (aTotalPoints > bTotalPoints) return -1;
};

const sortCupResults = function(a, b) {
  let aCupSorting = a.CupSorting;
  let bCupSorting = b.CupSorting;

  let aName = a.ManagerName;
  let bName = b.ManagerName;

  if (aCupSorting > bCupSorting) return -1;
  if (aCupSorting < bCupSorting) return 1;
  if (aName > bName) return 1;
  if (aName < bName) return -1;
};
