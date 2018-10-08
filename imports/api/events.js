import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Events = new Mongo.Collection('league_events');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('league_events', function eventsPublication() {
        return Events.find();
    });
}

Meteor.methods({
    'events.insert' (title, date) {
        check(title, String);
        check(date, Date);
     
        if (!Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
     
        Events.insert({
          Title: title,
          Created: new Date(),
          CreatedBy: Meteor.userId(),
          Date: date
        });
    },
    'events.remove' (id) {
        check(id, String);
      
        const event = Events.findOne(id);
    
        Events.remove(event);
    }
});