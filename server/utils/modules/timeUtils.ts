import fs from 'fs'
import path from 'path'

// Función para formatear fechas
export function formatDate(unix_timestamp: Date, format: string = 'Y-m-d'): string {
    const date=new Date(unix_timestamp);
    const dateObject={
        'Y' : date.getFullYear(),
        'm' : String(date.getMonth()+1).padStart(2,'0'),
        'd' : String(date.getDate()).padStart(2,'0'),
        'H' : String(date.getHours()).padStart(2,'0'),
        'i' : String(date.getMinutes()).padStart(2,'0'),
        's' : String(date.getSeconds()).padStart(2,'0'),
    };
    var dateString='';
    for (let char of format) {
        if(char in dateObject){
            dateString+=dateObject[char];
        }else{
            dateString+=char;
        }
    }
    return dateString;
}

// Función para capitalizar la primera letra de una cadena
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para validar si un email es válido
export function isValidEmail(email: string): boolean {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
}

// Función para truncar una cadena a una longitud específica y agregar '...'
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

// Función para calcular los días laborables de un mes, excluyendo sábados y domingos
export function calculateWorkingDaysInMonth(year: number, month: number): { year: number; month: number; totalWorkingDays: number; totalWorkingHours: number; workingDays: Date[] } {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const workingDays: Date[] = [];
    let totalWorkingDays = 0;
    let totalWorkingHours = 0;

    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        const dayOfWeek = day.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const dayTime = new Date(day);
            const y = dayTime.getFullYear();
            const m = (dayTime.getMonth() + 1).toString().padStart(2, '0');
            const d = dayTime.getDate().toString().padStart(2, '0');
            totalWorkingDays++;
            workingDays.push(`${y}-${m}-${d}`);
            totalWorkingHours = totalWorkingDays * 8;
        }
    }



    return {
        year,
        month,
        totalWorkingDays,
        totalWorkingHours,
        workingDays,
    };
}

// Función para calcular los días laborables de cada mes en un año específico
export function calculateWorkingDaysPerMonthInYear(year: number): { [month: number]: { totalWorkingDays: number; totalWorkingHours: number; workingDays: Date[] } } {
    const resultDate = [];

    for (let month = 1; month <= 12; month++) {
        resultDate.push(calculateWorkingDaysInMonth(year, month));
    }

    return resultDate;
}

interface assignationObject {
    userId: string;
    fullName: string;
    employedId: string;
    projectId: string;
    projectName: string;
    projectExt: string;
    dedication: number;
    assignationHours: number;
    range: [number, number];
}

interface DateInfo {
    year: number;
    month: number;
    date: string;
    name: string;
    type: string;
}

export function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const firstDayOfWeek = firstDayOfYear.getDay(); // 0 (domingo) - 6 (sábado)
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfWeek) / 7);

    return weekNumber;
}

export function generateWorkingDatesWithInfo(assignationObject: assignationObject, dateArray: DateInfo[]): any[] {
    const { range } = assignationObject;
    const startDate = new Date(range[0]);
    const endDate = new Date(range[1]);

    const nonWorkingDates = dateArray.map(dateInfo => new Date(dateInfo.date));
    let workingDatesWithInfo: any[] = [];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        const isNonWorkingDate = nonWorkingDates.some(nonWorkingDate => nonWorkingDate.toDateString() === date.toDateString());

        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isNonWorkingDate) {
            const dayTS = new Date(date).valueOf()
            const newRecord = {
                "assignationHours": assignationObject.assignationHours,
                "dedication": assignationObject.dedication,
                "employedId": assignationObject.employedId,
                "fullName": assignationObject.fullName,
                "projectName": assignationObject.projectName,
                "projectExt": assignationObject.projectExt,
                "projectId":assignationObject.projectId,
                "userId": assignationObject.userId,
                "assignationDate": formatDate(dayTS, 'Y-m-d'),
                "assignationMonthYear": formatDate(dayTS, 'm/Y'),
                "weekNumber":  getWeekNumber(new Date(date))/*,
                "soft_delete": null*/
            }
            workingDatesWithInfo.push(newRecord);
        }
    }

    return workingDatesWithInfo;
}



