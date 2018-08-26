import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

if (Meteor.isServer) {
    Meteor.publish('users', function usersPublication() {
        return Meteor.users.find();
    });

    Meteor.publish('userData', function () {
      if (this.userId) {
        return Meteor.users.find({ _id: this.userId }, {
          fields: { 'role': 1 }
        });
      } else {
        this.ready();
      }
    });
}

Meteor.methods({
  'users.insert' (email, password) {
    check(email, String);
    check(password, String);
    
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
  
    Accounts.createUser({
      email: email,
      password: password
    });
  },
  'users.remove' (userId) {
    check(userId, String);
    
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
  
    Meteor.users.remove(userId);
  },
  'users.update' (userId, name) {
    check(userId, String);
    check(name, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update( { _id: userId }, { $set: { 'name': name }} );
  }
});