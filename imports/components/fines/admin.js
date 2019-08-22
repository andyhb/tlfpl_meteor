import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import "./admin.html";

Template.finesAdmin.onCreated(function bodyOnCreated() {
  const currentUser = Meteor.user();

  if (!currentUser) {
    FlowRouter.go("/");
  }

  if (
    !currentUser.role ||
    currentUser.role !== "admin" ||
    currentUser.role !== "fines-admin"
  ) {
    FlowRouter.go("/");
  }
});
