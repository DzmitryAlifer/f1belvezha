import {PlayerRoundResult, User} from 'src/app/types';


export interface ToolbarState {
    currentUser: User | null;
    isDarkMode: boolean;
    isLoaded: boolean;
    isLockedLayout: boolean;
    playersResults: PlayerRoundResult[];
}
