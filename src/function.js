// import axios from 'axios';
// axios.defaults.baseURL = 'https://pixabay.com/api/';

// export async function serviceImages(image, page) {
//   const KEY = '39787944-43ec837227cb503858330c56a';
//   const resp = await axios.get(
//     `${BASE_URL}?key=${KEY}&q=${image}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
//   );
//   const response = resp.data;

//   return response;
// }
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function serviceImages(image, page) {
  const KEY = '39787944-43ec837227cb503858330c56a'; // Додайте свій API ключ з Pixabay
  try {
    const resp = await axios.get('', {
      params: {
        key: KEY,
        q: image,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });
    const response = resp.data;
    return response;
  } catch (error) {
    throw error;
  }
}
