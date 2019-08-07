import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import Chart from "chart.js";

import { Table } from "../../api/table.js";
import { Teams } from "../../api/teams.js";
import "./chart.html";

const pinkMode = new ReactiveVar(true);
const onlyOwn = new ReactiveVar(false);
const showPoints = new ReactiveVar(false);
const currentUserTeam = new ReactiveVar();

Template.chart.onCreated(function bodyOnCreated() {
  Meteor.subscribe("table");
  Meteor.subscribe("teams");
  Meteor.subscribe("currentUserTeamId");

  this.autorun(() => {
    const team = Teams.findOne();

    if (team) {
      currentUserTeam.set(team);
    }
  });
});

Template.chart.onRendered(function() {
  this.autorun(() => {
    let g = Globals.findOne();

    if (g) {
      let gameweeks = [];
      let tableDatasets = [];
      let options = {
        scales: {
          yAxes: [
            {
              ticks: {
                reverse: true,
                min: 1,
                max: 10,
                stepsize: 1
              }
            }
          ]
        }
      };

      if (showPoints.get()) {
        options = {};
      }

      Table.find({
        SeasonId: g.SeasonId
      }).forEach(function(table) {
        gameweeks.push(table.Gameweek);

        table.Standings.forEach(function(teamStanding) {
          if (teamStanding.TeamName === "Dyslexia Untied") {
            teamStanding.TeamName = "Victor Moses Lawn";
          }

          let teamData = tableDatasets.filter(
            tds => tds.label === teamStanding.TeamName
          )[0];

          if (teamData) {
            teamData.data.push(
              showPoints.get()
                ? teamStanding.TotalPoints
                : teamStanding.Position
            );
          } else {
            teamData = {};
            teamData.label = teamStanding.TeamName;
            if (pinkMode.get()) {
              teamData.borderColor = "rgb(255,99,132)";
            } else {
              let currentTeam = Teams.findOne(teamStanding.TeamId);
              teamData.borderColor = currentTeam.ChartColour;

              if (currentTeam.ChartStyle === "Dashed") {
                teamData.borderDash = [5, 5];
              }

              teamData.backgroundColor = teamData.borderColor;
              teamData.fill = false;
            }

            teamData.data = [
              showPoints.get()
                ? teamStanding.TotalPoints
                : teamStanding.Position
            ];

            if (onlyOwn.get() && currentUserTeam.get()) {
              if (currentUserTeam.get()._id !== teamStanding.TeamId) {
                teamData.hidden = true;
              }
            }

            tableDatasets.push(teamData);
          }
        });
      });

      var ctx = document.getElementById("myChart");
      var chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: gameweeks,
          datasets: tableDatasets
        },
        options: options
      });
    }
  });
});

Template.chart.events({
  "click #customColours"() {
    pinkMode.set(!pinkMode.get());
  },
  "click #onlyOwn"() {
    onlyOwn.set(!onlyOwn.get());
  },
  "click #showPoints"() {
    showPoints.set(!showPoints.get());
  }
});
