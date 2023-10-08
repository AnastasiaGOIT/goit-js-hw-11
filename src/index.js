import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const btn = document.querySelector('.search-btn');
const container = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

loadBtn.hidden = true;
form.addEventListener('submit', handleSearch);

async function handleSearch(e) {
  e.preventDefault();
  btn.disabled = true;
  const input = form.elements.searchQuery;
  const inputValue = input.value.trim();

  try {
    const data = await serviceImages(inputValue);
    const markupEl = markUp(data.hits);
    container.innerHTML = markupEl;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    form.reset();
    btn.disabled = false;
  }
}

async function serviceImages(image) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '39787944-43ec837227cb503858330c56a';

  const resp = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${image}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const response = resp.data;
  console.log(response);
  return response;
}
// btn.addEventListener('click');
function markUp(images) {
  return images
    .map(
      image => `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" width='200' loading="lazy" />
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

let page = 1;
loadBtn.addEventListener('click', onLoadmore);

// function serviceLoad(page = 1) {
//   const params = new URLSearchParams();
// }

function onLoadmore() {}
