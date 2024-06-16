import axios from 'axios';
import { Showable } from './showable';
const elements = {
  loading: new Showable('.loader'),
  error: new Showable('.error'),
};

axios.defaults.headers.common['x-api-key'] = 'live_pMCfR6LBn2xPtA30XNUDqQuzNboweMfLkokOv7CgweK1nlwealH4JxkyIFM711st';
axios.defaults.timeout = 1000;

export const fetchBreeds = () => {
  elements.loading.show();
  elements.error.hide();
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      return response;
    })
    .then(response => response.data.map(({ id, name }) => ({ id, name })))
    .catch(error => {
      // console.error(error);
      elements.error.show();
    })
    .finally(() => {
      elements.loading.hide();
    });
};

export const fetchBreed = id => {
  if (!id) {
    return null;
  }

  elements.loading.show();
  elements.error.hide();

  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${id}`)
    .then(response => response.data[0])
    .then(breedInfo => {
      const { url, breeds } = breedInfo;
      const { id, name, description, temperament } = breeds[0];
      return { id, name, description, temperament, image_url: url };
    })
    .catch(error => {
      // console.error(error);
      elements.error.show();
      return null;
    })
    .finally(() => {
      elements.loading.hide();
    });
};
