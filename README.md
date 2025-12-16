# SpaceWar Game

## Features
- Mouse-controlled spaceship
- Auto-shooting weapons
- Three difficulty levels
- Local high score saving
- Enemy boss battles
- Progressive difficulty

## Quick Start
1. **Open the game**: Double-click `index.html`
2. **Start playing**: Click the "Play" button
3. **Control ship**: Move mouse to fly
4. **Shoot enemies**: Weapons fire automatically

## How to Play
- Click "Play" to begin
- Move mouse → spaceship follows
- Destroy enemy ships
- Avoid collisions
- Try to beat your high score

## Game Rules
- Each small enemy = 1 point
- Each boss enemy = 10 points  
- Enemy hits ship = Game Over
- Difficulty increases with score

## Controls
- **Mouse movement** = Move spaceship
- **Automatic** = Shooting
- **Game restarts** = Click "Play Again" after game over

## Screenshots
<img width="300" height="384" alt="Снимок экрана 2025-12-16 174430" src="https://github.com/user-attachments/assets/3f015bb6-def1-4829-b641-caae7c70edb1" />
<img width="300" height="441" alt="Снимок экрана 2025-12-16 174523" src="https://github.com/user-attachments/assets/bbbd7ee6-0b10-4001-8652-279aa71be98f" />
<img width="600" height="400" alt="Снимок экрана 2025-12-16 174608" src="https://github.com/user-attachments/assets/bb6cf49a-be83-4818-b969-a757277cdce6" />

## Project Structure

```
SpaceWar/
├── index.html          # Main page (menu)
├── play.html           # Game page
├── css/
│   ├── index.css       # Main page styles
│   └── play.css        # Game page styles
├── img/
│   ├── alien1.png      # Regular enemy
│   ├── alien1_boss.png # Boss enemy
│   ├── boom.png        # Explosion animation
│   ├── bullet.png      # Player bullet
│   ├── space.png       # Space background
│   └── spaceship.png   # Player spaceship
└── js/
    ├── app/
    │   └── app.js      # Main application file
    ├── pages/
    │   ├── home.js     # Main page logic
    │   └── setting.js  # Settings page logic
    ├── play/
    │   └── play.js     # Main game logic
    └── router/
        └── router.js   # Router (navigation)
```
