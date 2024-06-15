import { fetchBreeds, fetchBreed } from './js/cat-api';

const elements = {
  select: document.querySelector('.breed-list'),
  info: document.querySelector('.breed-info-wrapper'),
};

const BREED_LIST_KEY = 'breedList';
const BREED_EXPIRY = 3600000 * 24; // 24 hours

const populateSelect = breedList => {
  const optionElements = [];

  breedList.forEach(({ id, name }) => {
    const optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.textContent = name;
    optionElements.push(optionEl);
  });

  elements.select.append(...optionElements);
  elements.select.addEventListener('change', onBreedSelect);
};

const onBreedSelect = event => {
  event.preventDefault();
  const selectedBreedId = event.target.value;

  if (!selectedBreedId) {
    elements.info.innerHTML = '';

    return;
  }

  fetchBreed(selectedBreedId)
    .then(showBreedInformation)
    .catch(error => {
      console.error(error);
    });
};

const showBreedInformation = ({ name, description, temperament, image_url }) => {
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
  console.log({ breedList, len: breedList?.length });
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
  let breedList = [];
  try {
    breedList = await fetchBreeds();
    saveLocalBreedList(breedList);
  } catch (error) {
    console.error(error);
  }
  return breedList;
};

(async () => {
  let breedList = getLocalBreedList() || (await updateBreedList());

  populateSelect(breedList);
})();
