import {Home} from "../pages/home.js";
import {Settings} from "../pages/setting.js";

const app = document.getElementById('app');

export function router() {
    let hash = window.location.hash || '#/home';
    hash = hash.replace('#', '').replace('/', '').toLowerCase();
    
    switch(hash) {
        case 'home':
            Home(app);
            break;
        case 'settings':
            Settings(app);
            break;
        default:
            app.innerHTML = `
            <div class="text">
                <h1>404</h1>
            </div>
            `;
    }
    
}