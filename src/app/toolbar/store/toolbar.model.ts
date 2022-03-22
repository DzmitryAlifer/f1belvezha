import {Language, Page} from 'src/app/enums';
import {PlayerRoundResult, User} from 'src/app/types';


export interface ToolbarState {
    currentUser: User | null;
    isDarkMode: boolean;
    isLoaded: boolean;
    isLockedLayout: boolean;
    language: Language;
    lastRound: number;
    page: Page;
    playersResults: PlayerRoundResult[];
}
