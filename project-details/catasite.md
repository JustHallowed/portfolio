**Role:** Solo developer (all design and programming)
**Timeline:** Oct 2021 - Feb 2022 (82 commits)
**Tech:** Unity 2020.3 (URP), C#, HLSL, Shader Graph, Cinemachine, NavMesh

The Witch Hunters' Guild executed your grandmother for witchcraft. They were right, but revenge is still owed. You sold your soul and your sight to the devil for the power to raise and possess the dead. Now you fight through the guild using the bodies of its own hunters.

Catasite is a 2D action platformer about a blind hero who fights by sound and takes over the corpses of fallen enemies.

---

## Seeing by sound

The player can't see, so the screen starts dark. A right-click sends out an echolocation pulse. Where it hits walls, platforms and enemies, they light up briefly and then fade back into darkness.

![Echolocation pulse](catasite/Echolocation.gif)

Each pulse fires a fan of rays across a 45° arc. The edge of the wave is traced against the walls, so it follows the shape of the room. Every hit becomes a **sound point** that grows, lingers for about 5 seconds and shrinks.

Each frame, up to 200 sound points (position, radius, strength) go to a **custom HLSL shader** as one array. For every pixel, it works out how much is revealed, with a soft edge and a rippling wave. A second version runs as post-processing over the darkened scene. Hits that land close to an existing point refresh it instead of adding a new one, which keeps the shader fast in busy fights.

Sound doesn't only come from the pulse. Footsteps, impacts and the boss's hammer slam reveal the world as well, so moving and fighting are a way of seeing.

![Footsteps revealing the level](catasite/Footsteps.gif)

---

## Possessing the dead

Fallen hunters leave corpses. Press **E** to take over the nearest one in line of sight. Your controls, camera and abilities switch to that body, and its weapon is **upgraded** while you're inside. The corpse's remaining "condition" becomes its health.

![Possession](catasite/Possession.gif)

Under the hood, each control is connected to the current body's abilities through C# delegates. Movement, the Cinemachine camera target and the physics layers all switch over to it, and the corpse's AI navigation turns off while you're inside.

When the body gives out, you're thrown out, and that has its own cost. You have to **click 3 times** to break free, and then you launch toward the cursor. Use it to spring towards enemies or get over obstacles.

![Ejecting from a corpse](catasite/Eject.gif)

---

## Combat with flexible abilities

Every attack is an ability stored as a data asset (a Unity ScriptableObject), with its own copy for each character. Each one has a wind-up time, a cooldown, where it spawns, and whether you can move while using it. Every enemy has a normal and an upgraded version, and the game switches between them when you possess or leave a body.

Projectiles react to each other. Arrows stick into whatever they hit, **ricochet** off walls when upgraded and fast, and can be **knocked back** at the shooter by a melee sweep. Ranged attacks show an aiming arc that accounts for gravity and stops at walls.

![Aiming, ricochet and deflection](catasite/Combat.gif)

---

## Hunters that see and hear

Enemies run a state machine with idle, patrol, chase and attack states. They see through a **sight cone blocked by walls** and **hear** within a radius. After losing you, they keep searching for a while before giving up. Navigation uses Unity's NavMesh, plus a third-party tool that automatically adds jump paths between platforms.

One hunter type is **invisible** and only shows up in the light of your echolocation, so you have to keep pulsing to fight it.

---

## The Grand Hunter

The boss alternates between a **close-range combo** with timed hit windows and a **long-range hammer slam** that sends out a shockwave on landing. Leaps, dashes and taunts sit in between. The slam also creates a sound point, so the boss's attacks briefly show you the arena.

![Boss attack cycle](catasite/Boss.gif)

The impacts feel heavy because of three effects: screen-space shockwave distortions (reused from a pool, built by cloning a URP render pass at runtime), Cinemachine camera shake that dies down, and pooled blood particles.

---

## Structure and polish

- 5 levels joined by portals, some of them fake, plus a boss arena
- Background loading with fades, and each level's music set in a JSON file
- A short grace window for late jumps, and separate ground and air controls
- An options menu whose volume settings are saved, and sound players reused from a pool
- Credits that scroll in time with the ending music
---

**Credits:** Player sprite by SeethingWarm. Enemy sprites by OCO. UI and font by Mounir Tohami. Arrow sprite by TheShallowNight. Music by xDeviruchi. Sound effects from freesound.org (SilverIllusionist, Vlatko Blažek, Norman_Hittle, newlocknew).
