import {Page} from 'src/app/enums';
import {PlayerRoundResult, User} from 'src/app/types';


export interface ToolbarState {
    currentUser: User | null;
    isDarkMode: boolean;
    isLoaded: boolean;
    isLockedLayout: boolean;
    page: Page;
    playersResults: PlayerRoundResult[];
}
