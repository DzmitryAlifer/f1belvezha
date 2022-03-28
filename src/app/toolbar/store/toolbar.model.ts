import {Language, Page} from 'src/app/enums';
import {PlayerRoundResult, Race, User} from 'src/app/types';


export interface ToolbarState {
    calendar: Race[];
    currentUser: User | null;
    isDarkMode: boolean;
    isLoaded: boolean;
    isLockedLayout: boolean;
    language: Language;
    lastRound: number;
    page: Page;
    playersResults: PlayerRoundResult[];
}
