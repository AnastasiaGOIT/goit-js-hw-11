import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const btn = document.querySelector('.search-btn');
const container = document.querySelector('.gallery');
// const loadBtn = document.querySelector('.load-more');

const target = document.querySelector('.js-guard');

let page = 1;

form.addEventListener('submit', handleSearch);

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(onLoadScroll, options);

function onLoadScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      const input = form.elements.searchQuery;
      const inputValue = input.value.trim();
      const data = serviceImages(inputValue, page);
      const markupEl = markUp(data.hits);
      container.innerHTML += markupEl;
      if (page > data.totalHits / 40) {
        observer.unobserve(target);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}

// loadBtn.addEventListener('click', onLoad);

async function handleSearch(e) {
  e.preventDefault();
  btn.disabled = true;
  page = 1;
  const input = form.elements.searchQuery;
  const inputValue = input.value.trim();
  if (!inputValue) {
    btn.disabled = false;
    Notiflix.Notify.failure('Write something');
    return;
  }
  try {
    const data = await serviceImages(inputValue);
    // if (data.hits.length >= 40) {
    //   loadBtn.style.display = 'block';
    // } else {
    //   loadBtn.style.display = 'none';
    // }
    const markupEl = markUp(data.hits);
    container.innerHTML = markupEl;
    observer.observe(target);
    let gallery = new SimpleLightbox('.photo-card a');
    gallery.refresh();

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    form.reset();
    // loadBtn.style.display = 'none';
    btn.disabled = false;
  }
}

async function serviceImages(image, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '39787944-43ec837227cb503858330c56a';
  const resp = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${image}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const response = resp.data;
  console.log(response);
  return response;
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

// async function onLoad() {
//   page += 1;
//   // loadBtn.disabled = true;
//   const input = form.elements.searchQuery;
//   const inputValue = input.value.trim();
//   const data = await serviceImages(inputValue, page);

//   // if (page > data.totalHits / 40) {
//   //   loadBtn.style.display = 'none';
//   //   Notiflix.Notify.info(
//   //     "We're sorry, but you've reached the end of search results."
//   //   );
//   // } else {
//   //   loadBtn.hidden = false;
//   // }
//   const markupEl = markUp(data.hits);
//   container.innerHTML += markupEl;
//   loadBtn.disabled = false;

//   console.log(page);
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
