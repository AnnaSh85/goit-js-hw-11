import axios from "axios";

import Notiflix from 'notiflix';

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.load-more')

form.addEventListener('submit', getValue)
loadMore.addEventListener('click', getValue)

let formValue = ""
let page = 1
let resultForApi = 0
let lg = "ru"

function getValue(e) {
  e.preventDefault()
  if (formValue !== form.elements.searchQuery.value) {
    gallery.innerHTML = " "
    loadMore.hidden = true
    page = 1
  }
  if (!form.elements.searchQuery.value) {
    return
  }
  
  formValue = form.elements.searchQuery.value
  apiData(formValue)
}


async function apiData(request) {
  const URL = "https://pixabay.com/api/?key=";
  const API_KEY = "31959718-480cdd2164520f69972499037";
  const PARAMS = `&q=${request}&image_type=photo&orientation=horizontal&lang=${lg}&safesearch=true&page=${page}&per_page=40`;
  
  await axios.get(URL+API_KEY+PARAMS)
  .then(function (response) { 
    if (response.data.total === 0) {
      return Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
    }
    resultForApi = response.data.total;
    
    parseData(response);
      loadMore.hidden = false;
      

    if (page === 1) {
      Notiflix.Notify.success(`We find ${response.data.total} images`)
      }

    if (response.data.total <= 40 * page) {
        Notiflix.Notify.success("We're sorry, but you've reached the end of search results.")
        loadMore.hidden = true;
    }
    
  })
  .catch(function (error) {  
    alert(error)   
  })
  page += 1

  
};

function parseData(response) {
  const markup = response.data.hits
  .map(({largeImageURL, tags, likes, views, comments, downloads}) => {
    return `
    <div class="photo-card">
    <a class="card-link" href="${largeImageURL}">
    <div class="thumb">
      <img src="${largeImageURL}" alt="${tags}" loading="lazy" class="img"/>
    </div>
    </a>
    <div class="info">
      <p class="info-item">
        Likes ${likes}
      </p>
      <p class="info-item">
        Views${views}
      </p>
      <p class="info-item">
        Comments ${comments}
      </p>
      <p class="info-item">
        Downloads ${downloads}
      </p>
    </div>
    </div>`;
  })
  .join("");

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox(".gallery a", { captionDelay: 300, captionsData: 'alt' });
}
