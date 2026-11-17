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
      //   detailsFile: name of a Markdown file in the `project-details/` folder, e.g. 'broken-quest.md',
      //                shown in the popup (headings, lists, **bold**, [links](...); line breaks are kept).
      //                Embed media on its own line with ![caption](url): YouTube links and .mp4 files play
      //                as videos, anything else is an image; a bare file name like 'shot.png' means public/shot.png
      //   details: short Markdown text written here instead of a file
      //   `description` stays the short text on the card, and is used in the popup if neither is set
      //   videos: YouTube links or direct video URLs (e.g. '/portfolio/demo.mp4')
      //   screenshots: image URLs (files in `public/` are served at '/portfolio/<file>')
      projects: [
          {
          title: 'Get Me Out of Hell',
          description:
            'Roguelite dungeon crawler for Windows and Android, built on a custom C++/OpenGL engine by a team of 7. I worked on rendering, tools and platform support. I built the 2D rendering and lighting pipeline, a command-pattern undo/redo, and a chunked tilemap editor. I also wrote a UI framework that works with mouse, touch and gamepad, and did much of the Android port (the JNI bridge)',
          imageUrl:
            '/portfolio/GMOHBanner.png',
          buttons: [{ label: 'View on GitHub', url: 'https://github.com/weijieng-dp/TUTU' }],
          detailsFile: 'get-me-out-of-hell.md',
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
            '2D RPG platformer built in Unity engine with a possession mechanic that gives unique abilities for different kinds of enemies. Blinded by a curse, you can only see through echolocation made possible with a custom authored shader',
          imageUrl:
            '/portfolio/CatasiteBanner.png',
          buttons: [{ label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=JaUAr721l7g' }],
          detailsFile: 'catasite.md',
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
          detailsFile: 'broken-quest.md',
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
