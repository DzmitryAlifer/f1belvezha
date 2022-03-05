import {User} from 'src/app/types';


export interface ToolbarState {
    currentUser: User | null;
    isDarkMode: boolean;
}
