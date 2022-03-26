import {Team} from "./app/enums";


export const PREDICTION_PLACES_NUMBER = 5;
export const CURRENT_USER_KEY = 'currentUser';

export const DRIVER_TEAM_MAPPING = new Map<string, string>()
    .set('Hamilton', Team.Mercedes)
    .set('Russell', Team.Mercedes)
    .set('Verstappen', Team.RedBull)
    .set('Pérez', Team.RedBull)
    .set('Sainz', Team.Ferrari)
    .set('Leclerc', Team.Ferrari)
    .set('Norris', Team.McLaren)
    .set('Ricciardo', Team.McLaren)
    .set('Ocon', Team.Alpine)
    .set('Alonso', Team.Alpine)
    .set('Gasly', Team.AlphaTauri)
    .set('Tsunoda', Team.AlphaTauri)
    .set('Stroll', Team.AstonMartin)
    .set('Vettel', Team.AstonMartin)
    .set('Hülkenberg', Team.AstonMartin)
    .set('Albon', Team.Williams)
    .set('Latifi', Team.Williams)
    .set('Bottas', Team.AlfaRomeo)
    .set('Zhou', Team.AlfaRomeo)
    .set('Schumacher', Team.Haas)
    .set('Magnussen', Team.Haas);

export const TEAM_DRIVER_COLORS: any = {
    Hamilton: '#6cd3bf',
    Russell: '#6cd3bf',
    Verstappen: '#1e5bc6',
    Pérez: '#1e5bc6',
    Sainz: '#ff0000',
    Leclerc: '#ff0000',
    Norris: '#f58020',
    Ricciardo: '#f58020',
    Bottas: '#b12039',
    Zhou: '#b12039',
    Alonso: '#2293d1',
    Ocon: '#2293d1',
    Gasly: '#4e7c9b',
    Tsunoda: '#4e7c9b',
    Stroll: '#00594f',
    Vettel: '#00594f',
    Hülkenberg: '#00594f',
    Albon: '#37bedd',
    Latifi: '#37bedd',
    Magnussen: '#b6babd',
    Schumacher: '#b6babd',
};
