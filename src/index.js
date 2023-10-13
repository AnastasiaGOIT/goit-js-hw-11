import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { serviceImages } from './function';

const form = document.querySelector('.search-form');
const btn = document.querySelector('.search-btn');
const container = document.querySelector('.gallery');
form.addEventListener('submit', handleSearch);

const target = document.querySelector('.js-guard');
let gallery = new SimpleLightbox('.photo-card a');
let page = 1;

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '39787944-43ec837227cb503858330c56a';

function getValue() {
  const input = form.elements.searchQuery;
  const inputValue = input.value.trim();

  return inputValue;
}

async function handleSearch(e) {
  e.preventDefault();
  btn.disabled = true;
  page = 1;
  const inputValue = getValue();

  if (!inputValue) {
    btn.disabled = false;
    Notiflix.Notify.failure('Write something');
    return;
  }
  try {
    const data = await serviceImages(inputValue);
    if (data.totalHits < 40) {
      const markupEl = markUp(data.hits);
      container.innerHTML = markupEl;
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return;
    }
    observer.observe(target);
    gallery.refresh();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    e.target.reset();
    btn.disabled = false;
  }
}

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoadScroll, options);

async function onLoadScroll(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      page += 1;
      inputValue = getValue();
      const data = await serviceImages(inputValue, page);
      const markupEl = markUp(data.hits);
      container.innerHTML += markupEl;
      if (page > data.totalHits / 40) {
        observer.unobserve(target);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        smoothScroll();
      }
    }
  });
}

function markUp(images) {
  return images
    .map(
      image => `<div class="photo-card"> 
  <a href="${image.largeImageURL}"><img class='img' src="${image.webformatURL}" alt="${image.tags}" width='300' loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
