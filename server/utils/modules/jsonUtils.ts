import fs from 'fs'
import path from 'path'
import { getMenuData } from './staticCollection';

/**
 * Read and return the content of a JSON file.
 * @param {string} filename - The name of the JSON file (without the extension).
 * @returns {any} - The parsed JSON content.
 */
export function readJSONFile(filename: string): any {
    const dataDirectory = path.resolve('./server/utils/modules/data')
    const filePath = path.join(dataDirectory, `${filename}.json`)
    //const filePath = new URL(`${filename}.json`, import.meta.url)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
}

/**
 * Ordena un array de objetos JSON según el valor de un atributo y el tipo de orden.
 *
 * @param {Array<Object>} jsonArray - El array de objetos JSON a ordenar.
 * @param {string} attribute - El atributo por el cual se ordenará el array.
 * @param {string} order - El tipo de orden: "asc" (ascendente) o "desc" (descendente).
 * @return {Array<Object>} El array de objetos JSON ordenado.
 */
export function sortJsonArrayByAttribute(jsonArray: Array<Object>, attribute: string, order: 'asc' | 'desc'): Array<Object> {
    const sortedArray = [...jsonArray];

    sortedArray.sort((a, b) => {
        let aValue = a[attribute];
        let bValue = b[attribute];

        // Comparación de fechas
        if (typeof aValue === 'string' && typeof bValue === 'string' && !isNaN(Date.parse(aValue)) && !isNaN(Date.parse(bValue))) {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        // Comparación ascendente
        if (order === 'asc') {
            if (aValue > bValue) {
                return 1;
            } else if (aValue < bValue) {
                return -1;
            } else {
                return 0;
            }
        }
        // Comparación descendente
        else {
            if (aValue < bValue) {
                return 1;
            } else if (aValue > bValue) {
                return -1;
            } else {
                return 0;
            }
        }
    });

    return sortedArray;
}

/**
 * Ordena un array de objetos JSON según el valor de un atributo y el tipo de orden.
 *
 * @param {Array<Object>} profileSecurityArray - El perfil de seguridad a validar.
 * @return {Array<Object>} El array de menu JSON depurado.
 */
export function processMenu(profileSecurityArray: Object): Array<Object> {

    const profile = profileSecurityArray; //Object.assign({}, profileSecurityArray);
    const menu = getMenuData();
    let newMenu = [];

    menu.forEach(item => {
        if(profile.isSuper){
            delete item.access;
            newMenu.push(item)
        }else if (profile.roles){
            profile.roles.forEach(p => {
                if(item.access && item.access.indexOf(p.area)> -1 && (p.admin || p.write || p.read)){
                    delete item.access;
                    newMenu.push(item)
                }
            });
        }
    });

    return newMenu;

}
