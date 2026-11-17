Broken Quest - March 2023 - Godot 3 / GDScript - team of 4

A top-down shooter where you fight through rooms that loop endlessly, spend what you collect in a shop between runs, and keep an eye on a sleepiness meter as well as your health. I was one of two programmers and wrote about half the project's commits.

## What I built

- Data-driven item system. Items are defined in JSON, and each one links to a short script for its effect, so adding a new item takes no changes to the core code. The five items include consumables that heal or restore sleepiness, and upgrades that stack bonuses onto damage, max health and magazine size.
- Inventory, hotbar and shop. One reusable slot component powers the inventory, the hotbar and the shop. The hotbar stays in sync with the inventory through Godot signals. The shop handles buying, the in-game currency, and a "sleep" option that ends the run, where the player loses items.
- Procedural room loop. Rooms are generated and linked as you go, with smooth camera moves between them. Portals spawn at set intervals, and a loop counter feeds a difficulty system that scales enemy health and resets player modifiers on each run.
- Spider boss AI. A state machine with five states (idle, chase, stalk, cower and death) decides what the spider does by checking which way the player is facing. It backs off when you look at it and closes in when you turn away. It lives in its own dark, fog-covered room.
- Player and game feel. I wrote the player's stats and controls, the health bar, and a shader-based vignette at the screen edges that pulses and fades as the player gets sleepier. I also added the music and sound effects.

## Takeaways

I had to ship systems that worked together under a 10-day deadline. That meant designing small, reusable pieces like the shared slot component and the JSON-defined items, and coordinating closely through Git with my teammate as we both worked on the same codebase.
