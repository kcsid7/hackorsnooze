"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


function navNewStoryF(evt) {
  evt.preventDefault();
  console.log("Pressed")
  hidePageComponents();
  // $allStoriesList.show();
  $newStoryForm.show();
  $favStories.hide();
  $userStories.hide();
}


$navNewStory.on("click", navNewStoryF);


$body.on("click", "#nav-fav-story", (evt) => {
  evt.preventDefault();
  hidePageComponents();
  addFavsToPage();
  $newStoryForm.hide();
  $favStories.show();
  $userStories.hide();

});

$body.on("click", "#nav-user-story", (evt) => {
  evt.preventDefault();
  hidePageComponents();
  addUserStoriesToPage();
  $userStories.show();
  $newStoryForm.hide();
  $favStories.hide();
});

$navUserProfile.on("click", (evt) => {
  evt.preventDefault();
  hidePageComponents();
  $userInfo.show();
});