// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'JustHallowed', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/portfolio/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: true, // Forked projects will not be displayed if set to true.
          projects: ['JustHallowed/WidgetTestPage'], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['weijieng-dp/TUTU'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      // Clicking a project opens a popup. Optional popup fields per project:
      //   buttons: link buttons at the top of the popup, e.g. [{ label: 'Play on itch.io', url: 'https://...' }]
      //            (if empty, `link` is shown as a "View Project" button)
      //   details: longer text for the popup; use backticks (`...`) to write it over multiple lines,
      //            with a blank line between paragraphs and `<br>` for a line break within one;
      //            `description` stays the short text on the card, and is used in the popup if `details` is empty
      //   videos: YouTube links or direct video URLs (e.g. '/portfolio/demo.mp4')
      //   screenshots: image URLs (files in `public/` are served at '/portfolio/<file>')
      projects: [
          {
          title: 'Get Me Out of Hell',
          description:
            'Roguelite dungeon crawler for Windows and Android, built on a custom C++/OpenGL engine by a team of 7. I worked on rendering, tools and platform support. I built the bloom, vignette and 2D lighting pipeline, the framebuffer and camera systems, a command-pattern undo/redo, and a chunked tilemap editor. I also wrote a UI framework that works with mouse, touch and gamepad, and did much of the Android port: the JNI bridge, OpenGL ES 3 rendering, touch input and FMOD audio.',
          imageUrl:
            '/portfolio/GMOHBanner.png',
          buttons: [{ label: 'View on GitHub', url: 'https://github.com/weijieng-dp/TUTU' }],
          details: `Role: Engine, graphics and tools programmer, and lead on the Android port
Team: 7 programmers, DigiPen Singapore, GAM200/250 student game project
Timeline: Aug 2025 – Apr 2026 (429 commits)
Tech: C++17, OpenGL 4 / OpenGL ES 3, GLSL, ImGui + ImGuizmo, FMOD, RapidJSON, FreeType, GLM, CMake, Gradle, JNI, Android NDK

---

The product

Get Me Out Of Hell is a top-down, wave-based action roguelite. It runs on Windows and Android and is built on an engine our team wrote from scratch. The player is a timid creature trying to escape a hell filled with "scary humans". Its nervous comments react to what happens in play, for example "Yuck! Eyeballs?" or "Are all humans this scary?".

Gameplay loop:
- Map: Choose a path across a grid-based map of rooms: a start room, combat rooms, a treasure room and the final exit.
- Combat: Survive waves of enemies such as Eyeballs, Larvae, Oni, and human "Guy" and "Girl" variants. Each wave picks enemies from a weighted list and spawns them over time.
- Items: After combat you choose items that change your stats, many of them Japanese desserts like daifuku and dango. Matching items evolve into stronger versions. Effects include homing shots, multishot, burst fire, and poison, freeze and slow trails.
- Meta-progression: Achievements unlock harder enemy tiers and appear as stamps on the main menu.
- Presentation: Opening and ending video cutscenes, an onboarding tutorial, a minimap, a pause menu, and a settings menu for audio and post-processing.

The whole game is data-driven. Items, waves, map tiles, dialogue and achievements are all JSON files that designers can edit without rebuilding.

The engine is an ECS architecture. It includes a scene stack, or serialization and the editor inspector, a broad-phasecollision grid, a physics system, pathfinding, particles, an event system, a native C++ scripting API, and a full ImGui editor for building levels.

---

My contributions

1. Rendering and visual effects

I built most of the game's visual effects and the framebuffer setup they run on.                                                                      
- Post-processing pipeline:                                                                                                                           - A bright-pass shader with a threshold picks out the bright
  - A two-pass Gaussian blur bounces between two framebuffers (ping-pong).
  - The blurred result is blended back as bloom with adjustable exposure, then a vignette with adjustable intensity and falloff is applied.
  - Every setting lives in a PostProcessComponent so designers can tune it in the editor, and players can turn it off in settings (saved between sessions).
- 2D lighting: Lights use shape textures for custom silhouettes and have their own color and brightness. A global lighting pass sets the base light leand the lights are blended together to give the dungeon its
- Emissive rendering: Emissive colors and textures pass through the instanced batch renderer, so glowing sprites feed into bloom without extra draw calls.
- Framebuffer system (sole author): A reusable offscreen framebuffer class with configurable attachments. ScreenManager owns the screen, bright-pass, ping-pong blur, lighting and minimap buffers, and resizes anor device changes. I also wrote entity IDs into an integerframebuffer so clicking in the editor viewport selects the object under the mouse.
- Camera system (sole author): Orthographic projection rebuilt from viewport size and zoom, conversion from screen to view to world coordinates, editor pan and zoom (keyboard and scroll wheel), and correct letterboxing on narrow aspect ratios such as phone screens.
- Sprite animation (sole author): Sprite-sheet animation with nd other configurable properties.
- Co-author (with Tan Jun Jie): the instanced sprite batching (I designed the per-instance data layout and the color modifiers) and world-space text rendering.

2. Editor tools

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

3. UI framework and engine systems

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

4. Android port

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

5. Gameplay programming

- Object pooling (sole author): Inactive objects are reused pehen needed. It's used for projectiles and particles so theydon't allocate memory mid-combat.
- Projectiles (sole author): Stat-driven lifetime, a particle g toward the nearest enemy, and hit sounds that get quieter and pan left or right with distance.
- Shooting (co-author): Attack speed and burst fire, multishot with spread angles, and status-effect trails, all driven by item stats.
- Health system: Taking damage, invincibility frames, and callbacks when hit or killed, which drive the win and lose conditions.
- Menu scripts: Volume sliders for each audio group, scene-change, quit and post-processing toggle buttons, and playing audio from UI buttons.`, // Longer text shown in the popup
        },
        {
          title: 'Mask Motel',
          description:
            'Submission for Global Game Jam 2026 - You are a mask artist making ends meet by creating human disguises for monsters. Though business is lucrative, your customers can be quite... rowdy.',
          imageUrl:
            '/portfolio/MaskMotelBanner.png',
          buttons: [{ label: 'Play on itch.io', url: 'https://justhallowed.itch.io/mask-motel' }],
          details: '', // Longer text shown in the popup
        },
        {
          title: 'Catasite',
          description:
            '2D RPG platformer built in Unity engine with a possession mechanic that gives unqiue abilities for different kinds of enemies. Blinded by a curse, you can only see through echolocation made possible with a custom authored shader',
          imageUrl:
            '/portfolio/CatasiteBanner.png',
          buttons: [{ label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=JaUAr721l7g' }],
          details: '', // Longer text shown in the popup
          videos: ['https://www.youtube.com/watch?v=JaUAr721l7g'],
          screenshots: [],
        },
        {
          title: 'Broken Quest',
          description:
            'Submission for Godot Wild Jam 55 - a top-down roguelite shooter made in 10 days for Godot Wild Jam #55 by a team of four. I built the item, inventory and shop systems, the procedural room loop, and an enemy whose behaviour depends on which way the player is facing.',
          imageUrl:
            '/portfolio/BrokenQuestBanner.png',
          buttons: [{ label: 'Play on itch.io', url: 'https://justhallowed.itch.io/broken-quest' }],
          details: `Broken Quest - March 2023 - Godot 3 / GDScript - team of 4

A top-down shooter where you fight through rooms that loop endlessly, spend what you collect in a shop between runs, and keep an eye on a sleepiness meter as well as your health. I was one of two programmers and wrote about half the project's commits.

What I built

- Data-driven item system. Items are defined in JSON, and each one links to a short script for its effect, so adding a new item takes no changes to the core code. The five items include consumables that heal or restore sleepiness, and upgrades that stack bonuses onto damage, max health and magazine size.
- Inventory, hotbar and shop. One reusable slot component powers the inventory, the hotbar and the shop. The hotbar stays in sync with the inventory through Godot signals. The shop handles buying, the in-game currency, and a "sleep" option that ends the run, where the player loses items.
- Procedural room loop. Rooms are generated and linked as you go, with smooth camera moves between them. Portals spawn at set intervals, and a loop counter feeds a difficulty system that scales enemy health and resets player modifiers on each run.
- Spider boss AI. A state machine with five states (idle, chase, stalk, cower and death) decides what the spider does by checking which way the player is facing. It backs off when you look at it and closes in when you turn away. It lives in its own dark, fog-covered room.
- Player and game feel. I wrote the player's stats and controls, the health bar, and a shader-based vignette at the screen edges that pulses and fades as the player gets sleepier. I also added the music and sound effects.

Takeaways

I had to ship systems that worked together under a 10-day deadline. That meant designing small, reusable pieces like the shared slot component and the JSON-defined items, and coordinating closely through Git with my teammate as we both worked on the same codebase.`, // Longer text shown in the popup
        },
      ],
    },
  },
  seo: { title: 'Portfolio of Ou Yukang', description: '', imageURL: '' },
  social: {
    linkedin: 'yukang-ou',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: '',
    phone: '',
    email: '',
  },
  resume: {
    fileUrl:
      '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'C/C++', 'C#', 'Java', 'Unity Engine', 'Godot Engine', 'ImGUI', 'Github Actions', 'Java Native Interface', 'React.js'
  ],
  experiences: [
    // {
    //   company: 'Company Name',
    //   position: 'Position',
    //   from: 'September 2021',
    //   to: 'Present',
    //   companyLink: 'https://example.com',
    // },
    // {
    //   company: 'Company Name',
    //   position: 'Position',
    //   from: 'July 2019',
    //   to: 'August 2021',
    //   companyLink: 'https://example.com',
    // },
  ],
  certifications: [
  //   {
  //     name: 'Lorem ipsum',
  //     body: 'Lorem ipsum dolor sit amet',
  //     year: 'March 2022',
  //     link: 'https://example.com',
  //   },
  ],
  educations: [
    {
      institution: 'Singapore Institute of Technology-Digipen',
      degree: 'Computer Science in Real-Time Interactive Simulation',
      from: '2024',
      to: '2028',
    },
    {
      institution: 'Nanyang Polytechnic',
      degree: 'Diploma in Game Development and Technology',
      from: '2019',
      to: '2022',
    },
  ],
  publications: [
    {
      title: 'Mirror, Mirror on the Wall: A New Teleportation Method for Us All',
      conferenceName: 'ISMARW',
      journalName: '',
      authors: 'Y. Ou, B. W. J. Kwok, J. S. Lee and K. Chen',
      link: 'https://ieeexplore.ieee.org/document/11236321',
      description:
        'Leveraging natural reflection-inspired physics to streamline teleportation within complex virtual environments allowing teleportation paths to bounce off surfaces while previewing the destination',
    },
  ],
  // // Display articles from your medium or dev account. (Optional)
  // blog: {
  //   source: 'dev', // medium | dev
  //   username: 'arifszn', // to hide blog section, keep it empty
  //   limit: 2, // How many articles to display. Max is 10.
  // },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'retro',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      // 'light',
      // 'dark',
      // 'cupcake',
      // 'bumblebee',
      // 'emerald',
      // 'corporate',
      // 'synthwave',
      'retro',
      // 'cyberpunk',
      // 'valentine',
      // 'halloween',
      // 'garden',
      // 'forest',
      // 'aqua',
      // 'lofi',
      // 'pastel',
      // 'fantasy',
      // 'wireframe',
      // 'black',
      // 'luxury',
      // 'dracula',
      // 'cmyk',
      // 'autumn',
      // 'business',
      // 'acid',
      // 'lemonade',
      // 'night',
      // 'coffee',
      // 'winter',
      // 'dim',
      // 'nord',
      // 'sunset',
      // 'caramellatte',
      // 'abyss',
      // 'silk',
      // 'procyon',
    ],
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with <a 
      class="text-primary" href="https://github.com/arifszn/gitprofile"
      target="_blank"
      rel="noreferrer"
    >GitProfile</a> and ❤️`,

  enablePWA: true,
};

export default CONFIG;
