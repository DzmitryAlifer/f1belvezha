import {TeamName} from './app/enums';


export const PREDICTION_PLACES_NUMBER = 5;
export const CURRENT_USER_KEY = 'currentUser';
export const USER_DIALOG_OPTIONS = {disableClose: true, width: '270px'};

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

export const TEAM_NAMES = new Map<TeamName, string>()
    .set(TeamName.Mercedes, 'Mercedes')
    .set(TeamName.RedBull, 'Red Bull')
    .set(TeamName.Ferrari, 'Ferrari')
    .set(TeamName.McLaren, 'McLaren')
    .set(TeamName.Alpine, 'Alpine')
    .set(TeamName.AlphaTauri, 'Alpha Tauri')
    .set(TeamName.AstonMartin, 'Aston Martin')
    .set(TeamName.Williams, 'Williams')
    .set(TeamName.AlfaRomeo, 'Alfa Romeo')
    .set(TeamName.Haas, 'Haas');

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

export const DRIVER_IN_LIST_COLOR = '#cfd8dc';
export const DRIVER_CORRECT_PLACE_COLOR = '#ffc107';
export const CORRECT_TEAM_FROM_PAIR_COLOR = '#a5d6a7';
export const WRONG_TEAM_COLOR = '#ef9a9a';
