import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {CupGroupFixtures} from '../../api/cup.js';
import './fixtures.html';

Template.fixtures.onCreated(function bodyOnCreated() {
    Meteor.subscribe("cup_group_fixtures");
});

Template.fixtures.helpers({
    cupFixtures() {
        return CupGroupFixtures.find();
    },
    notBye(match) {
        return !match.Team1.Bye && !match.Team2.Bye;
    }
});