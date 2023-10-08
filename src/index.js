import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const btn = document.querySelector('.search-btn');
const container = document.querySelector('.gallery');

form.addEventListener('submit', handleSearch);

async function handleSearch(e) {
  e.preventDefault();
  btn.disabled = true;
  const input = form.elements.searchQuery;
  const inputValue = input.value.trim();

  try {
    const imageName = await serviceImages(inputValue);
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
  const KEY = '39787944 - 43ec837227cb503858330c56a';

  const resp = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${image}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  //     .then(data => console.log(data.data));
  //   console.log(resp);
}
// btn.addEventListener('click');
// function markUp() {}
