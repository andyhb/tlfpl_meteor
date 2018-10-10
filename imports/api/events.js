import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Events = new Mongo.Collection('league_events');

if (Meteor.isServer) {
    Meteor.publish('league_events', function eventsPublication() {
        return Events.find();
    });

    Meteor.publish('league_events_upcoming', function eventsUpcomingPublication() {
        return Events.find({
            Date: { $gte : new Date()}
        });
    });

    Meteor.publish('league_events_upcoming_homepage', function eventsUpcomingHomePagePublication() {
        return Events.find({
            Date: { $gte : new Date()},
            ShowOnHomePage: 1
        });
    });
}

Meteor.methods({
    'events.insert' (title, date, type) {
        check(title, String);
        check(date, Date);
        check(type, String);
     
        if (!Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
     
        Events.insert({
          Title: title,
          Created: new Date(),
          CreatedBy: Meteor.userId(),
          Date: date,
          Type: type
        });
    },
    'events.remove' (id) {
        check(id, String);
      
        const event = Events.findOne(id);
    
        Events.remove(event);
    },
    'events.setShowOnHomePage' (id, setChecked) {
        check(id, String);
        check(setChecked, Boolean);

        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
     
        Events.update(id, {
          $set: {
            ShowOnHomePage: setChecked
          }
        });
    },
});