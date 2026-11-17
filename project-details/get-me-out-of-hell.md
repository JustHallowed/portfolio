**Role:** Engine, graphics and tools programmer, and lead on the Android port
**Team:** 7 programmers, DigiPen Singapore, GAM200/250 student game project
**Timeline:** Aug 2025 - Apr 2026 (429 commits)
**Tech:** C++17, OpenGL 4 / OpenGL ES 3, GLSL, ImGui + ImGuizmo, FMOD, RapidJSON, FreeType, GLM, CMake, Gradle, JNI, Android NDK

---

## The product

Get Me Out Of Hell is a top-down, wave-based action roguelite. It runs on Windows and Android and is built on an engine our team wrote from scratch.

Gameplay loop:
- Map: Choose a path across a grid-based map of rooms: a start room, combat rooms, a treasure room and the final exit.
- Combat: Survive waves of enemies such as Eyeballs, Larvae, Oni, and human variants. Each wave picks enemies from a weighted list and spawns them over time.
- Items: After combat you choose items that change your stats, many of them Japanese desserts like daifuku and dango. Matching items evolve into stronger versions. Effects include homing shots, multishot, burst fire, and poison, freeze and slow trails.
- Meta-progression: Achievements unlock harder enemy tiers and appear as stamps on the main menu.
- Presentation: Opening and ending video cutscenes, an onboarding tutorial, a minimap, a pause menu, and a settings menu for audio and post-processing.

The whole game is data-driven. Items, waves, map tiles, dialogue and achievements are all JSON files that designers can edit without rebuilding.

The engine is an ECS architecture. It includes a scene stack, or serialization and the editor inspector, a broad-phasecollision grid, a physics system, pathfinding, particles, an event system, a native C++ scripting API, and a full ImGui editor for building levels.

---

## My contributions

### 1. Rendering and visual effects

I built most of the game's visual effects and the framebuffer setup they run on.
- Post-processing pipeline:
  - A bright-pass shader with a threshold picks out the bright
  - A two-pass Gaussian blur bounces between two framebuffers (ping-pong).
  - The blurred result is blended back as bloom with adjustable exposure, then a vignette with adjustable intensity and falloff is applied.
  - Every setting lives in a PostProcessComponent so designers can tune it in the editor, and players can turn it off in settings (saved between sessions).
- 2D lighting: Lights use shape textures for custom silhouettes and have their own color and brightness. A global lighting pass sets the base light leand the lights are blended together to give the dungeon its
- Emissive rendering: Emissive colors and textures pass through the instanced batch renderer, so glowing sprites feed into bloom without extra draw calls.
- Framebuffer system (sole author): A reusable offscreen framebuffer class with configurable attachments. ScreenManager owns the screen, bright-pass, ping-pong blur, lighting and minimap buffers, and resizes anor device changes. I also wrote entity IDs into an integerframebuffer so clicking in the editor viewport selects the object under the mouse.
- Camera system (sole author): Orthographic projection rebuilt from viewport size and zoom, conversion from screen to view to world coordinates, editor pan and zoom (keyboard and scroll wheel), and correct letterboxing on narrow aspect ratios such as phone screens.
- Sprite animation (sole author): Sprite-sheet animation with nd other configurable properties.
- Co-author (with Tan Jun Jie): the instanced sprite batching (I designed the per-instance data layout and the color modifiers) and world-space text rendering.

### 2. Editor tools

- Undo/redo (sole author):
  - It uses the command pattern: an ActionBase with Execute() and GetInverse(), and a templated ActionSetValue<T> that can undo any component field.
  - Creating and deleting entities is undoable too.
  - Dragging a slider or gizmo caches the starting value and records one action when you let go, rather than one per frame. The undo history keeps 30 steps.
  - Transforms, UI transforms and every reflected component figh it.
- Tilemap editor (sole author):
  - It cuts a tileset image into a tile palette automatically.
  - You paint and erase on a grid in the viewport.
  - The map is stored in chunks, so it has no fixed size.
  - Tilesets can be dragged and dropped in, and maps save to and load from JSON.
- Smaller features: Custom cursors, "F" to jump the camera to the selected entity, mapping the mouse from the viewport into the world, and editor camera controls that only respond when the viewport has focus.

### 3. UI framework and engine systems

- UI system (sole author):
  - Each button runs a four-state cycle (idle, hovered, presse touch or gamepad through one shared code path.
  - A gamepad can move between buttons by direction.
  - When elements overlap, the one drawn on top gets the click.
  - A UITransform anchors elements to a parent and combines tho the layout holds up from desktop screens to phones.
  - It includes draggable sliders that work with every input type.
- Saved user settings (sole author): A config file read and written through RapidJSON and connected to the in-game settings menu.
- Application lifecycle (sole author): Engine managers are registered with the application, and quitting goes through the event system so shutdown is
  clean on every platform.
- Co-author: the scene stack (push, pop and change, with cached entities and fixes for leaks and stretching), background-music queueing with crossfades, and MPEG cutscene playback.

### 4. Android port

I did much of the work to bring the engine and game from Windows to Android across 80 commits; Ng Wei Jie co-authored parts of it.

- JNI bridge: Native entry points for starting OpenGL, rendering each frame, screen size changes, touch events, focus changes and cleanup. These connect the Java Activity to the C++ engine.
- Platform layer: Assets load through Android's asset manager behind the same file API the desktop build uses, so game code doesn't care which platform it's on.
- Rendering on OpenGL ES 3:
  - I made the shaders and renderer work on GLES 3.
  - I fixed problems that only appeared on devices: the entity-ID buffer, screen size not being set, and framebuffers being lost when the app lost focus.
- Input and lifecycle:
  - Touch handling tracks each finger separately for multi-tou
  - The game pauses and resumes cleanly when you leave the app.
  - It runs in immersive landscape mode with the system bars hidden.
- Audio and build:
  - FMOD runs on Android, with its native library bundled for each CPU architecture.
  - The Gradle and CMake build fetches GLM, ImGui and FreeType automatically and compiles the engine as a single shared library.

### 5. Gameplay programming

- Object pooling (sole author): Inactive objects are reused pehen needed. It's used for projectiles and particles so theydon't allocate memory mid-combat.
- Projectiles (sole author): Stat-driven lifetime, a particle g toward the nearest enemy, and hit sounds that get quieter and pan left or right with distance.
- Shooting (co-author): Attack speed and burst fire, multishot with spread angles, and status-effect trails, all driven by item stats.
- Health system: Taking damage, invincibility frames, and callbacks when hit or killed, which drive the win and lose conditions.
- Menu scripts: Volume sliders for each audio group, scene-change, quit and post-processing toggle buttons, and playing audio from UI buttons.
