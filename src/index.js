import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetch-function';

const DEBOUNCE_DELAY = 300;

const searchForm = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchForm.addEventListener(
  'input',
  debounce(e => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';

    const query = e.target.value.trim();

    if (!query) {
      return;
    }

    fetchCountries(query)
      .then(responce => {
        if (responce.length === 1) {
          renderCountryInfo(responce[0]);
        } else if (responce.length <= 10) {
          renderCountriesList(responce);
        } else
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
      })
      .catch(error =>
        Notiflix.Notify.failure('Oops, there is no country with that name')
      );
  }, DEBOUNCE_DELAY)
);

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `
        <li class="list">
             <p>${official}</p>
            <img src="${svg}" alt="flag" width="35" height = "100%">
        </li>
      `;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo({
  name: { official },
  flags: { svg },
  capital,
  population,
  languages,
}) {
  const language = Object.values(languages).join(',');
  console.log(capital);
  const markup = `
    <div class="img-container">
      <div class="img-inner">
        <div class="inner-skew">
          <img src="${svg}"  alt="flag">
         </div>
      </div>
    </div>
    <div class="text-container">
      <h3> ${official}</h3>
        <div>
            <p><b>Capital</b>: ${capital}</p>
            <p><b>Population</b>: ${population}</p>
            <p><b>Languages</b>: ${language}</p>
        </div>
      `;
  countryInfo.innerHTML = markup;
}
