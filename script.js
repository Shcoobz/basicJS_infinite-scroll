require('dotenv').config();

// Define your Unsplash API key and initial count of images to load
const APIKEY = 'AO2ra6u4sQgTEKaqK6UYwVlZc4mB1LLpGNMAgmy10mY';
let INITIAL_COUNT = 5;

// Create the initial API URL
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${APIKEY}&count=${INITIAL_COUNT}`;

// Get references to HTML elements
const imgContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

// Initialize variables for tracking loading state
let ready = false;
let isInitialLoad = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Function to update the API URL with a new image count
function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${APIKEY}&count=${picCount}`;
}

// Function to set attributes for HTML elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Function to handle image loaded event
function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Function to display fetched photos on the page
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  photosArray.forEach((photo) => {
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });

    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    img.addEventListener('load', imageLoaded);

    item.appendChild(img);
    imgContainer.appendChild(item);
  });
}

// Function to fetch photos from the Unsplash API
async function fetchPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();

    displayPhotos();

    if (isInitialLoad) {
      updateAPIURLWithNewCount(30); // Update to load more images in subsequent scrolls
      isInitialLoad = false;
    }
  } catch (error) {
    // Handle errors here
  }
}

// Function to check scroll position and trigger fetching more photos
function checkScrollPosition() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;

    fetchPhotos();
  }
}

// Add a scroll event listener to check for scrolling
window.addEventListener('scroll', checkScrollPosition);

// Initial fetch of photos when the page loads
fetchPhotos();
