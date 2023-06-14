module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.tsx"
  ],
  theme: {
    extend: {
      backgroundImage:{
        'banner-white': "url('/static/bg/bg_banner_white.png')",
        'banner': "url('/static/bg/bg_banner.png')",
        'blue': "url('/static/bg/bg_blue.png')",
        'blue-panel': "url('/static/bg/bg_blue_panel.jpg')",
        'claim': "url('/static/bg/bg_claim.jpg')",
        'collection': "url('/static/bg/bg_collection.jpg')",
        'collection-transparent': "url('/static/bg/bg_collection.png')",
        'cyan': "url('/static/bg/bg_cyan.jpg')",
        'dao': "url('/static/bg/bg_dao.jpg')",
        'faq': "url('/static/bg/bg_faq.jpg')",
        'kingdom': "url('/static/bg/bg_kingdom.jpg')",
        'long': "url('/static/bg/bg_long.jpg')",
        'purple-image': "url('/static/bg/bg_purple.jpg')",
        'ecosystem': "url('/static/bg/bg_ecosystem.png')",
        'ecosystem2': "url('/static/bg/bg_ecosystem2.jpg')",
        'ecosystem3': "url('/static/bg/bg_ecosystem3.png')",
        'ecosystem4': "url('/static/bg/bg_ecosystem4.png')"
      },
      colors:{
        yellow:{
          DEFAULT:'#FFC000',
          dark:'#AA8321',
        },
        orange:{
          DEFAULT:'#E84E0A',
          light:'#fe8835'
        },
        gray:{
          DEFAULT:'#727275',
          dark:'#4C4C4F',
          dark2:'#212529',
          light:'#E1E1E1'
        },
        turquoise:{
          DEFAULT:'#078C8E',
          dark:'#075556'
        },
        purple:{
          DEFAULT: '#683C8E',
          dark: '#40214B',
          light: '#9770B1'
        },
        green:{
          DEFAULT: '#95DC26',
          dark: '#319B19'
        },
        dark: '#680E59',
        dark3: '#161217',
        hatchAnimation: '#0D0915',
        celestial: '#FFDC62',
        light: '#FFDC62',
        plant: '#5EB620',
        water: '#4FD5FF',
        fire: '#DF3333',
        void: '#680E59',
        shiny: '#F9DC63'
      },

      fontFamily:{
        sans: ['Montserrat','sans-serif'],
        government: ['GovernmentAgentBB','sans-serif'],
        monstserrat: ['Montserrat','sans-serif'],
        grotesk: ['AkzidenzGroteskBQ','sans-serif'],
        quicksilver: ['Quicksilver','sans-serif']
      },
      height: {
        '86':'23rem'
      },
      maxHeight:{
        '2xl': '42rem'
      },
      minWidth:{
        'xs': '20rem'
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
      },
      border:{
        "3": "3px"
      },
      transitionProperty: {
        'max-height': 'max-height'
      },
      dropShadow: {
        'opaque': '6px 6px 6px rgba(0, 0, 0, 0.9)',
        'blue': '0px 0px 10px rgba(54, 191, 231, 1)',
        'yellow': '0px 0px 10px rgba(254,221,29, 0.5)'
      }
    },
    variants:{
      display: ['hover'],
      backgroundColor: ['even'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
