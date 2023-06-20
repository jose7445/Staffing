import { readJSONFile } from './jsonUtils';
import exportOffices from './data/offices';
const config = useRuntimeConfig();
const ka_department = config.kaDeparment;
export function getOffices() { return exportOffices() }
export function getQuestionTypes() { return readJSONFile('question_types') }
export function getLanguages() { return readJSONFile('languages') }
export function getKADepartments() { return readJSONFile('ka_departments') }
export function getMenuData() { return readJSONFile('menu') }
export function getCandidatesData() { return readJSONFile('candidates_options_' + ka_department) }
export function getQuizzCandidatesData() { return readJSONFile('quizz_candidates_options_' + ka_department) }
export function getStaffData() { return readJSONFile('staffMember_options_' + ka_department) }
export function getProjectsData() { return readJSONFile('projects_options_' + ka_department) }
export function getWorkdaysData() { return readJSONFile('workdays') }
