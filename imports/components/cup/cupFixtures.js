import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import { CupGroupFixtures, CupKnockoutFixtures } from "../../api/cup.js";
import "./cupFixtures.html";

const cupGameweek = new ReactiveVar();

Template.cupFixtures.onCreated(function bodyOnCreated() {
  Meteor.subscribe("cup_group_fixtures");
  Meteor.subscribe("cup_knockout_fixtures");
});

Template.home.onCreated(function bodyOnCreated() {
  Meteor.subscribe("cup_group_fixtures");
  Meteor.subscribe("cup_knockout_fixtures");
});

Template.home.helpers({
  cupWeek() {
    let g = Globals.findOne();

    if (g) {
      const groupFixtures = CupGroupFixtures.find({
        SeasonId: g.SeasonId,
        $or: [
          { "Fixtures.Gameweek": g.Gameweek },
          { "Fixtures.Gameweek": g.Gameweek + 1 }
        ]
      }).count();

      const koFixtures = CupKnockoutFixtures.find({
        SeasonId: g.SeasonId,
        $or: [
          { "Fixtures.Week": g.Gameweek },
          { "Fixtures.Week": g.Gameweek + 1 }
        ]
      }).count();

      if ((groupFixtures && groupFixtures > 0) || (koFixtures && koFixtures > 0)) {
        return true;
      }
    }

    return false;
  }
});

Template.cupFixtures.helpers({
  fixturesForGameweek() {
    let g = Globals.findOne();

    if (g) {
      let cupGroupFixtures = CupGroupFixtures.find({
        SeasonId: g.SeasonId,
        $or: [
          { "Fixtures.Gameweek": g.Gameweek },
          { "Fixtures.Gameweek": g.Gameweek + 1 }
        ]
      });

      let fixtures = [];
      let fixtureGameweeks = [];

      if (cupGroupFixtures.count() > 0) {
        cupGroupFixtures.forEach(function(group) {
          group.Fixtures.forEach(function(week) {
            if (week.Gameweek == g.Gameweek || week.Gameweek == g.Gameweek + 1) {
              week.Matches.forEach(function(match) {
                if (!match.Team1.Bye && !match.Team2.Bye) {
                  fixtureGameweeks.push(week.Gameweek);
                  match.GroupName = group.GroupName;
                  fixtures.push(match);
                }
              });
            }
          });
        }); 
      } else {
        cupGroupFixtures = CupKnockoutFixtures.find({
          SeasonId: g.SeasonId,
          $or: [
            { "Fixtures.Week": g.Gameweek },
            { "Fixtures.Week": g.Gameweek + 1 }
          ]
        });

        cupGroupFixtures.forEach(function(group) {
          group.Fixtures.forEach(function(week) {
            if (week.Week == g.Gameweek || week.Week == g.Gameweek + 1) {
              week.Matches.forEach(function(match) {
                if (!match.Team1.Bye && !match.Team2.Bye) {
                  fixtureGameweeks.push(week.Week);
                  match.GroupName = group.Round;
                  fixtures.push(match);
                }
              });
            }
          });
        });
      }

      if (fixtures.length > 0) {
        let uniqueGameweeks = fixtureGameweeks.filter(onlyUnique);
        cupGameweek.set(uniqueGameweeks.join("/"));
        return fixtures;
      }
    }
  },
  getGameweek() {
    return cupGameweek.get();
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
  }
});

const onlyUnique = function(value, index, self) {
  return self.indexOf(value) === index;
};
