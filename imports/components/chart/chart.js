import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';

import {Table} from '../../api/table.js';
import './chart.html';

Template.chart.onCreated(function bodyOnCreated() {
    Meteor.subscribe("table");
});

Template.chart.onRendered(function () {
    this.autorun(() => {
        let gameweeks = [];
        let tableDatasets = [];

        Table.find({}).forEach(function(table) {
            gameweeks.push(table.Gameweek);

            table.Standings.forEach(function(teamStanding) {
                let teamData = tableDatasets.filter(tds => tds.label === teamStanding.TeamName)[0];

                if (teamData) {
                    teamData.data.push(teamStanding.Position);
                } else {
                    teamData = {};
                    teamData.label = teamStanding.TeamName;
                    if (teamStanding.TeamName === "Rich's Belly Floppers") {
                        teamData.borderColor = 'rgb(151,245,245)';
                    } else if (teamStanding.TeamName === "Cotton Pickers") {
                        teamData.borderColor = 'rgb(176,128,64)';
                    } else if (teamStanding.TeamName === "TBA FC") {
                        teamData.borderColor = 'rgb(227,37,107)';
                    } else if (teamStanding.TeamName === "Dyslexia Untied") {
                        teamData.borderColor = 'rgb(40,106,77)';
                    } else if (teamStanding.TeamName === "FC Quichetopol") {
                        teamData.borderColor = 'rgb(236,213,64)';
                    } else if (teamStanding.TeamName === "Bangkok Young Boys") {
                        teamData.borderColor = 'rgb(183,132,167)';
                    } else if (teamStanding.TeamName === "Lads On Toure") {
                        teamData.borderColor = 'rgb(255,0,0)';
                        teamData.borderDash = [5,5];
                    } else if (teamStanding.TeamName === "Pinky's U-11s") {
                        teamData.borderColor = 'rgb(50,50,255)';
                    } else if (teamStanding.TeamName === "BJ Falls FC") {
                        teamData.borderColor = 'rgb(110,238,110)';
                    } else {
                        teamData.borderColor = 'rgb(255,99,132)';
                    }
                    teamData.backgroundColor = teamData.borderColor;
                    teamData.data = [teamStanding.Position];
                    teamData.fill = false;
                    tableDatasets.push(teamData);
                }
            });
        });
        
        var ctx = document.getElementById('myChart');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: gameweeks,
                datasets: tableDatasets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            reverse: true,
                        }
                    }]
                }
            }
        });
    });
});