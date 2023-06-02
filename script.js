const APIKEY = 'AO2ra6u4sQgTEKaqK6UYwVlZc4mB1LLpGNMAgmy10mY';
let INITIAL_COUNT = 5;

let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${APIKEY}&count=${INITIAL_COUNT}`;

const imgContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let isInitialLoad = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${APIKEY}&count=${picCount}`;
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

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

async function fetchPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();

    displayPhotos();

    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    // catch error here
  }
}

function checkScrollPosition() {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;

    fetchPhotos();
  }
}

window.addEventListener('scroll', checkScrollPosition);

fetchPhotos();
