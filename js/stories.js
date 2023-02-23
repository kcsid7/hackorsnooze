"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function userFavCheck(user, story) {
  const favStory = user.checkFav(story);
  return `<span class="fav_icon"><i class="fa-star ${favStory ? "fas" : "far"}"></i></span>`
}

function generateStoryMarkup(story, delBtn=false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const del_html = `<button class="del_btn"> X </button>`
  const loggedIn = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${delBtn ? del_html : ""}
        ${loggedIn ? userFavCheck(currentUser, story): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function deleteStory(evt) {
  // Delete Story
  const storyId = $(evt.target).closest("li").attr("id");
  await storyList.deleteStory(storyId, currentUser);
  
}

$userStories.on("click", "del_btn", deleteStory)


async function addNewStory(evt) {
// Add New Story On Form Submit
  evt.preventDefault();
  const newStory = {
    title: $("#new-title").val(),
    author: $("#new-author").val(),
    url: $("#new-url").val(),
    username: currentUser.username
  }

  const data = await storyList.addStory(currentUser, newStory);

  const $newStoryHtml = generateStoryMarkup(data);
  $allStoriesList.prepend($newStoryHtml);

  $newStoryForm.hide();
  $newStoryForm.trigger("reset");
}

$newStoryForm.on("submit", addNewStory)



function addFavsToPage() {
  /// Add User Fav Stories To Page
  $favStories.empty();

  if (currentUser.favorites.length !== 0) {
    for (let story of currentUser.favorites) {
      const $newStory = generateStoryMarkup(story);
      $favStories.append($newStory);
    }
  } 

  $favStories.show();

}


function addUserStoriesToPage() {

  $userStories.empty();

  if (currentUser.ownStories.length !== 0) {
    for (let story of currentUser.ownStories) {
      const $newStory = generateStoryMarkup(story);
      $userStories.append($newStory);
    }
  }

  $userStories.show();

}


async function toggleFavStory(evt) {

  const storyId = $(evt.target).closest("li").attr("id");
  const story = storyList.stories.find( st => st.storyId === storyId);

  if ($(evt.target).hasClass("fas")) {
    await currentUser.deleteFavorite(story);
  } else {
    await currentUser.addFavorite(story);
  }
  $(evt.target).closest("i").toggleClass("fas far")
}

$storiesList.on("click", ".fav_icon", toggleFavStory);
