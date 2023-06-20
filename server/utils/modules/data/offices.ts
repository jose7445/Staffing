import { readJSONFile } from '../jsonUtils';
const config = useRuntimeConfig();
const ka_department = config.kaDeparment;

const categories = readJSONFile('job_categories_' + ka_department);
const levels = readJSONFile('job_levels_' + ka_department);

function exportOffices() {
  let offices = [
    { "label":  "Barcelona", "value": "barcelona", "options": {
        "categories": categories,
        "levels": levels,
        "hollydays": readJSONFile('hollydays_barcelona')
      } },
    { "label":  "Madrid", "value": "madrid", "options": {
            "categories": categories,
            "levels": levels,
            "hollydays": readJSONFile('hollydays_madrid')
      } },
    { "label":  "Zaragoza", "value": "zaragoza", "options": {
            "categories": categories,
            "levels": levels,
            "hollydays": readJSONFile('hollydays_zaragoza')
      } },
    { "label":  "Valladolid", "value": "valladolid", "options": {
            "categories": categories,
            "levels": levels,
            "hollydays": readJSONFile('hollydays_valladolid')
      } }
  ]
  return offices;
}

export default exportOffices;
