import { fetchBreeds, fetchBreed } from './js/cat-api';

const BREED_LIST_KEY = 'breedList';
const BREED_EXPIRY = 3600000 * 24; // 24 hours
const elements = {
  section: document.querySelector('body > section'),
  info: document.querySelector('.breed-info-wrapper'),
};

const populateSelect = breedList => {
  const selectElement = document.createElement('select');
  selectElement.name = 'breed';
  selectElement.classList.add('breed-list');

  breedList.forEach(({ id, name }) => {
    const optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.textContent = name;
    selectElement.append(optionEl);
  });

  elements.section.insertAdjacentElement('afterbegin', selectElement);
  selectElement.addEventListener('change', onBreedSelect);
};

const onBreedSelect = event => {
  event.preventDefault();
  elements.info.innerHTML = '';
  const selectedBreedId = event.target.value;

  if (!selectedBreedId) {
    showBreedInformation();
    return;
  }

  fetchBreed(selectedBreedId)
    .then(showBreedInformation)
    .catch(error => {});
};

const showBreedInformation = (breedInformation = null) => {
  if (!breedInformation) {
    elements.info.innerHTML = '';
    return;
  }

  const { name, description, temperament, image_url } = breedInformation;
  const catEl = `
    <div class="breed-info">
        <img src="${image_url}" width="300" alt="${name}" class="thumb">
        <div>
            <h1 class="title">${name}</h1>
            <p class="description">${description}</p>
            <p class="temperament">${temperament}</p>
        </div>
    </div>`;

  elements.info.innerHTML = catEl;
};

const saveLocalBreedList = breedList => {
  if (!breedList || breedList?.length === 0) return;
  localStorage.setItem(BREED_LIST_KEY, JSON.stringify({ breedList, expire: Date.now() + BREED_EXPIRY }));
};

const getLocalBreedList = () => {
  const localDataString = localStorage.getItem(BREED_LIST_KEY);
  if (localDataString) {
    const localData = JSON.parse(localDataString);
    if (localData?.expire > Date.now()) {
      return localData.breedList;
    }
  }
  return;
};

const updateBreedList = async () => {
  const breedList = await fetchBreeds();
  saveLocalBreedList(breedList);

  return breedList;
};

(async () => populateSelect(getLocalBreedList() || (await updateBreedList())))();
