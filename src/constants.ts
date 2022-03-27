import {TeamName} from "./app/enums";


export const PREDICTION_PLACES_NUMBER = 5;
export const CURRENT_USER_KEY = 'currentUser';

export const DRIVER_TEAM_MAPPING = new Map<string, string>()
    .set('Hamilton', TeamName.Mercedes)
    .set('Russell', TeamName.Mercedes)
    .set('Verstappen', TeamName.RedBull)
    .set('Pérez', TeamName.RedBull)
    .set('Sainz', TeamName.Ferrari)
    .set('Leclerc', TeamName.Ferrari)
    .set('Norris', TeamName.McLaren)
    .set('Ricciardo', TeamName.McLaren)
    .set('Ocon', TeamName.Alpine)
    .set('Alonso', TeamName.Alpine)
    .set('Gasly', TeamName.AlphaTauri)
    .set('Tsunoda', TeamName.AlphaTauri)
    .set('Stroll', TeamName.AstonMartin)
    .set('Vettel', TeamName.AstonMartin)
    .set('Hülkenberg', TeamName.AstonMartin)
    .set('Albon', TeamName.Williams)
    .set('Latifi', TeamName.Williams)
    .set('Bottas', TeamName.AlfaRomeo)
    .set('Zhou', TeamName.AlfaRomeo)
    .set('Schumacher', TeamName.Haas)
    .set('Magnussen', TeamName.Haas);

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
