
import { Musician, Instrument, Genre, ExperienceLevel, Notification, NotificationType, Conversation, PortfolioItemType } from './types';

export const ALL_INSTRUMENTS: Instrument[] = Object.values(Instrument);
export const ALL_GENRES: Genre[] = Object.values(Genre);

export const MUSICIANS_DATA: Omit<Musician, 'followers' | 'following'>[] = [
  {
    id: 1,
    name: 'Alex Rivera',
    isVerified: true,
    location: 'New York, NY',
    instrument: Instrument.GUITAR,
    genres: [Genre.ROCK, Genre.BLUES, Genre.POP],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/1040/200/200',
    bio: 'Lead guitarist with 10+ years of touring experience. Looking for session work and new projects. Influenced by Hendrix, Clapton, and modern rock artists.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'alex.rivera@gigtune.com',
    expertise: ['Live Performance', 'Studio Recording', 'Improvisation'],
    reviews: [
      { id: 1, reviewerId: 2, reviewerName: 'Samantha Chen', reviewerAvatarUrl: 'https://picsum.photos/id/349/200/200', rating: 5, comment: 'Alex is a phenomenal guitarist. His solos are legendary. A true professional and great to work with.', date: new Date('2023-10-20T14:48:00.000Z').toISOString() },
      { id: 2, reviewerId: 3, reviewerName: 'Marcus Holloway', reviewerAvatarUrl: 'https://picsum.photos/id/1054/200/200', rating: 5, comment: 'Played a few gigs with Alex. Rock-solid rhythm and killer instinct on stage. Highly recommended.', date: new Date('2023-09-15T10:00:00.000Z').toISOString() }
    ],
    portfolio: [
      { id: 1, type: PortfolioItemType.IMAGE, url: 'https://picsum.photos/id/10/800/600', title: 'Live at The Fillmore', description: 'Headlining show from our 2023 tour.', comments: [], reactions: {'🔥': [2,3,4], '🎸': [5]} },
      { id: 2, type: PortfolioItemType.VIDEO, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnailUrl: 'https://i.picsum.photos/id/14/400/300.jpg', title: 'Blues Jam', description: 'Improvising a slow blues in E.', comments: [], reactions: {'👏': [2]} },
      { id: 3, type: PortfolioItemType.AUDIO, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', title: 'Studio Riff', description: 'A new song idea I\'m working on.', comments: [], reactions: {} }
    ]
  },
  {
    id: 2,
    name: 'Samantha Chen',
    isVerified: true,
    location: 'Los Angeles, CA',
    instrument: Instrument.VOCALS,
    genres: [Genre.POP, Genre.JAZZ, Genre.FUNK],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/349/200/200',
    bio: 'Versatile vocalist with a wide range. Comfortable with lead vocals, harmonies, and ad-libs. Currently fronting a local jazz trio and open to collaborations.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'samantha.chen@gigtune.com',
    expertise: ['Vocal Arrangement', 'Harmonizing', 'Songwriting'],
    reviews: [
      { id: 3, reviewerId: 1, reviewerName: 'Alex Rivera', reviewerAvatarUrl: 'https://picsum.photos/id/1040/200/200', rating: 5, comment: 'Samantha\'s voice is pure magic. She can sing anything and make it her own.', date: new Date('2023-11-01T12:30:00.000Z').toISOString() }
    ],
    portfolio: [
      { id: 4, type: PortfolioItemType.AUDIO, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', title: 'Jazz Standard Cover', description: 'A take on "Autumn Leaves".', comments: [], reactions: {'👏': [1, 4]} },
      { id: 5, type: PortfolioItemType.IMAGE, url: 'https://picsum.photos/id/21/800/600', title: 'Recording Session', description: 'Laying down some vocal tracks at Sunset Sound.', comments: [], reactions: {} }
    ]
  },
  {
    id: 3,
    name: 'Marcus Holloway',
    isVerified: true,
    location: 'Chicago, IL',
    instrument: Instrument.DRUMS,
    genres: [Genre.FUNK, Genre.HIPHOP, Genre.ROCK],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/1054/200/200',
    bio: 'Groove is everything. I provide a solid foundation for any band. Expert in pocket drumming and complex time signatures. Available for live gigs and studio sessions.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'marcus.holloway@gigtune.com',
    expertise: ['Pocket Drumming', 'Complex Time Signatures', 'Live Gigs'],
    reviews: [],
    portfolio: []
  },
  {
    id: 4,
    name: 'Eleanor Vance',
    location: 'London, UK',
    instrument: Instrument.CELLO,
    genres: [Genre.CLASSICAL, Genre.ELECTRONIC],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/203/200/200',
    bio: 'Classically trained cellist exploring the fusion of acoustic and electronic music. I use loop pedals and effects to create unique soundscapes. Seeking experimental projects.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'eleanor.vance@gigtune.com',
    expertise: ['Classical Arrangement', 'Live Looping', 'Sound Design'],
    reviews: [],
    portfolio: [
      { id: 6, type: PortfolioItemType.VIDEO, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnailUrl: 'https://i.picsum.photos/id/16/400/300.jpg', title: 'Live Looping Performance', description: 'Building a track from scratch with my cello and pedalboard.', comments: [], reactions: {} }
    ]
  },
  {
    id: 5,
    name: 'Javier "Javi" Rojas',
    location: 'Miami, FL',
    instrument: Instrument.BASS,
    genres: [Genre.FUNK, Genre.POP, Genre.BLUES],
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    avatarUrl: 'https://picsum.photos/id/326/200/200',
    bio: 'Bass player focused on laying down smooth, melodic basslines. I love the Motown sound but can adapt to many styles. Looking to join a working band.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'javi.rojas@gigtune.com',
    expertise: ['Fingerstyle', 'Slap Bass', 'Music Theory'],
    reviews: [],
    portfolio: []
  },
  {
    id: 6,
    name: 'Kenji Tanaka',
    location: 'Tokyo, JP',
    instrument: Instrument.KEYBOARD,
    genres: [Genre.JAZZ, Genre.ELECTRONIC, Genre.HIPHOP],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/453/200/200',
    bio: 'Pianist and synth wizard. My setup includes a Rhodes, a Moog, and a Nord Stage. I specialize in complex chord voicings and atmospheric pads.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'kenji.tanaka@gigtune.com',
    expertise: ['Jazz Voicings', 'Synth Programming', 'Music Production'],
    reviews: [],
    portfolio: []
  },
  {
    id: 7,
    name: 'Freya Olsen',
    isVerified: true,
    location: 'Stockholm, SE',
    instrument: Instrument.VOCALS,
    genres: [Genre.METAL, Genre.ROCK],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/599/200/200',
    bio: 'Powerful, operatic metal vocalist. Comfortable with both clean singing and harsh vocals. Looking for an established metal band for touring and recording.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'freya.olsen@gigtune.com',
    expertise: ['Harsh Vocals', 'Clean Singing', 'Operatic Style'],
    reviews: [],
    portfolio: []
  },
  {
    id: 8,
    name: 'David Lee',
    location: 'Austin, TX',
    instrument: Instrument.SAXOPHONE,
    genres: [Genre.JAZZ, Genre.BLUES, Genre.FUNK],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/385/200/200',
    bio: 'Tenor sax player with a soulful, energetic style. Great at improvisation and reading charts. I play regularly at local jazz clubs and am open to new ensembles.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'david.lee@gigtune.com',
    expertise: ['Improvisation', 'Chart Reading', 'Soul/Funk'],
    reviews: [],
    portfolio: []
  },
   {
    id: 9,
    name: 'Chloe Dubois',
    location: 'Paris, FR',
    instrument: Instrument.VIOLIN,
    genres: [Genre.CLASSICAL, Genre.POP],
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    avatarUrl: 'https://picsum.photos/id/628/200/200',
    bio: 'Violinist looking to bridge the gap between classical arrangements and modern pop music. Available for studio work to add string sections to tracks.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'chloe.dubois@gigtune.com',
    expertise: ['String Arrangement', 'Studio Session', 'Pop Music'],
    reviews: [],
    portfolio: []
  },
  {
    id: 10,
    name: 'Ben Carter',
    location: 'Nashville, TN',
    instrument: Instrument.GUITAR,
    genres: [Genre.BLUES, Genre.ROCK],
    experienceLevel: ExperienceLevel.HOBBYIST,
    avatarUrl: 'https://picsum.photos/id/659/200/200',
    bio: 'Slide guitar enthusiast learning the ropes. Looking for casual jams and to learn from more experienced players in the local blues scene.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'ben.carter@gigtune.com',
    expertise: ['Slide Guitar', 'Blues Rhythms', 'Jam Sessions'],
    reviews: [],
    portfolio: []
  },
  {
    id: 11,
    name: 'Isabella Rossi',
    isVerified: true,
    location: 'New Orleans, LA',
    instrument: Instrument.TRUMPET,
    genres: [Genre.JAZZ, Genre.BLUES],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/823/200/200',
    bio: 'Trumpet player with a classic, warm tone. Grew up playing in brass bands in the French Quarter. Available for gigs, tours, and recording sessions.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'isabella.rossi@gigtune.com',
    expertise: ['Brass Band', 'Jazz Solos', 'Live Gigs'],
    reviews: [],
    portfolio: []
  },
  {
    id: 12,
    name: 'Omar Hassan',
    location: 'Berlin, DE',
    instrument: Instrument.KEYBOARD,
    genres: [Genre.ELECTRONIC, Genre.TECHNO],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/1073/200/200',
    bio: 'Synth and drum machine programmer creating driving electronic beats. My workflow is primarily hardware-based. Looking to collaborate with vocalists and other producers.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'omar.hassan@gigtune.com',
    expertise: ['Hardware Synths', 'Drum Programming', 'Techno Production'],
    reviews: [],
    portfolio: []
  },
  {
    id: 13,
    name: 'Liam O\'Connor',
    location: 'Dublin, IE',
    instrument: Instrument.VOCALS,
    genres: [Genre.ROCK, Genre.POP],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/830/200/200',
    bio: 'Lead singer for an indie rock band. Strong baritone voice, comfortable with both high-energy anthems and acoustic ballads. Looking for co-writers.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'liam.oconnor@gigtune.com',
    expertise: ['Songwriting', 'Lead Vocals', 'Live Performance'],
    reviews: [
      { id: 4, reviewerId: 7, reviewerName: 'Freya Olsen', reviewerAvatarUrl: 'https://picsum.photos/id/599/200/200', rating: 4, comment: 'Great stage presence. Liam knows how to work a crowd.', date: new Date('2023-11-05T18:00:00.000Z').toISOString() }
    ],
    portfolio: []
  },
  {
    id: 14,
    name: 'Sofia Petrova',
    isVerified: true,
    location: 'Moscow, RU',
    instrument: Instrument.KEYBOARD,
    genres: [Genre.CLASSICAL],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/831/200/200',
    bio: 'Concert pianist with a focus on Romantic and contemporary composers. Graduated from the Moscow Conservatory. Available for recitals and tutoring.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'sofia.petrova@gigtune.com',
    expertise: ['Concert Performance', 'Classical Repertoire', 'Piano Tutoring'],
    reviews: [],
    portfolio: [
       { id: 7, type: PortfolioItemType.AUDIO, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', title: 'Chopin Nocturne', description: 'Nocturne in E-flat major, Op. 9 No. 2', comments: [], reactions: {} }
    ]
  },
  {
    id: 15,
    name: 'Diego Garcia',
    location: 'Barcelona, ES',
    instrument: Instrument.DRUMS,
    genres: [Genre.HIPHOP, Genre.FUNK],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/832/200/200',
    bio: 'Producer and beatmaker. I create lo-fi and boom-bap hip hop beats. Fluent with MPC and Ableton Live. Looking to work with rappers and singers.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'diego.garcia@gigtune.com',
    expertise: ['Beatmaking', 'Music Production', 'Ableton Live'],
    reviews: [],
    portfolio: []
  },
  {
    id: 16,
    name: 'Aisha Khan',
    location: 'Mumbai, IN',
    instrument: Instrument.VOCALS,
    genres: [Genre.POP, Genre.ELECTRONIC],
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    avatarUrl: 'https://picsum.photos/id/833/200/200',
    bio: 'Pop singer with a passion for electronic music. I love creating catchy melodies over synth-pop tracks. Seeking producers to collaborate with.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'aisha.khan@gigtune.com',
    expertise: ['Topline Writing', 'Pop Vocals', 'Studio Recording'],
    reviews: [],
    portfolio: []
  },
  {
    id: 17,
    name: 'Finn O\'Connell',
    location: 'Austin, TX',
    instrument: Instrument.BASS,
    genres: [Genre.FUNK, Genre.BLUES, Genre.ROCK],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/834/200/200',
    bio: 'Veteran bassist with a deep pocket and a love for all things groovy. Toured with several national acts. Reliable, professional, and ready for the next gig.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'finn.oconnell@gigtune.com',
    expertise: ['Live Gigs', 'Funk Basslines', 'Reading Charts'],
    reviews: [],
    portfolio: []
  },
  {
    id: 18,
    name: 'Hanna Schmidt',
    location: 'Berlin, DE',
    instrument: Instrument.KEYBOARD,
    genres: [Genre.TECHNO, Genre.ELECTRONIC],
    experienceLevel: ExperienceLevel.ADVANCED,
    avatarUrl: 'https://picsum.photos/id/835/200/200',
    bio: 'DJ and producer specializing in melodic techno. I perform live sets using a mix of hardware and software. Looking for vocalists for my next EP.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'hanna.schmidt@gigtune.com',
    expertise: ['DJing', 'Techno Production', 'Live Electronic Sets'],
    reviews: [],
    portfolio: [
        { id: 8, type: PortfolioItemType.VIDEO, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', thumbnailUrl: 'https://i.picsum.photos/id/18/400/300.jpg', title: 'Live at Berghain', description: 'An excerpt from my closing set last month.', comments: [], reactions: {} }
    ]
  },
  {
    id: 19,
    name: 'Carlos Reyes',
    isVerified: true,
    location: 'San Francisco, CA',
    instrument: Instrument.GUITAR,
    genres: [Genre.BLUES, Genre.ROCK, Genre.LATIN_ROCK],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/838/200/200',
    bio: 'Guitarist with a fiery, expressive style that blends blues, rock, and latin rhythms. My sound is all about emotion and tone. Available for session work.',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'carlos.reyes@gigtune.com',
    expertise: ['Blues Solos', 'Latin Rhythms', 'Tone Crafting'],
    reviews: [],
    portfolio: []
  },
  {
    id: 20,
    name: 'Jordan Miller',
    location: 'Nashville, TN',
    instrument: Instrument.DRUMS,
    genres: [Genre.POP, Genre.ROCK],
    experienceLevel: ExperienceLevel.PROFESSIONAL,
    avatarUrl: 'https://picsum.photos/id/839/200/200',
    bio: 'Session drummer with a knack for creating the perfect drum part for any song. I have a fully equipped home studio for remote recording. Let\'s make some hits!',
    // FIX: Changed 'contact' to 'email' to match the Musician type.
    email: 'jordan.miller@gigtune.com',
    expertise: ['Studio Drumming', 'Remote Recording', 'Pop Arrangements'],
    reviews: [
      { id: 5, reviewerId: 10, reviewerName: 'Ben Carter', reviewerAvatarUrl: 'https://picsum.photos/id/659/200/200', rating: 5, comment: 'Jordan laid down the perfect drum track for my demo. Super professional and quick turnaround.', date: new Date('2023-11-10T09:00:00.000Z').toISOString() }
    ],
    portfolio: []
  }
];

export const MUSICIANS: Musician[] = MUSICIANS_DATA.map(m => ({
    ...m,
    followers: [],
    following: [],
}));


export const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: NotificationType.GIG_OPPORTUNITY,
    title: 'Bassist Needed for Funk Band',
    summary: 'The Funky Spuds are looking for a bassist for a weekend gig at The Groove Lounge.',
    details: 'Our regular bassist is unavailable for the weekend of the 25th. We have a 3-hour set of funk and soul classics. Payment is $200 for the night. Rehearsal on Thursday. Please reply with a link to your playing if interested.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: NotificationType.EVENT,
    title: 'Open Mic Night at The Cavern',
    summary: 'Showcase your talent this Friday at our weekly open mic night. Sign-ups start at 7 PM.',
    details: 'All genres and instruments welcome! Each performer gets a 15-minute slot (approx. 3 songs). Come early to guarantee a spot. Great atmosphere and drink specials all night. A great chance to network with other local musicians.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
      id: 5,
      type: NotificationType.GIG_OPPORTUNITY,
      title: 'Seeking Session Drummer for Pop Album',
      summary: 'Recording a 5-track pop EP and need a versatile drummer for remote session work.',
      details: 'Looking for a drummer who can provide high-quality, multi-track recordings from a home studio. Tracks range from upbeat pop-rock to ballads. Please send examples of your studio work. Payment per track.',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
  },
  {
    id: 3,
    type: NotificationType.COLLABORATION_REQUEST,
    title: 'Vocalist Seeking Guitarist for Acoustic Duo',
    summary: 'Singer-songwriter looking for an acoustic guitarist to work on original material.',
    details: 'I have several songs written and I\'m looking for a creative guitarist to help with arrangements and perform at local cafes. Influences include Joni Mitchell, Nick Drake, and Fleet Foxes. Let\'s meet up and jam!',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 4,
    type: NotificationType.GIG_OPPORTUNITY,
    title: 'Jazz Trio needs a Drummer',
    summary: 'Established jazz trio requires a drummer for a regular Sunday brunch gig.',
    details: 'We play a mix of standards and original compositions. The gig is every Sunday from 11 AM to 2 PM at The Blue Note Cafe. Must be proficient in brushwork and able to swing. Reading charts is essential.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
      id: 6,
      type: NotificationType.COLLABORATION_REQUEST,
      title: 'Techno Producer looking for Vocalist',
      summary: 'Hanna Schmidt is looking for a vocalist for a new melodic techno track.',
      details: 'I have an instrumental track ready and am looking for a vocalist with an ethereal, atmospheric style to write and record a topline. The track is in C minor at 124 BPM. Happy to split royalties. Please get in touch if you\'re interested.',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
  }
];

// Assume current user is Alex Rivera (id: 1) for mock data
export const CONVERSATIONS: Conversation[] = [
  {
    id: '1-2',
    participantIds: [1, 2],
    messages: [
      { id: 1, senderId: 1, text: 'Hey Sam! Loved your latest track. Your vocals are amazing.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 2, senderId: 2, text: 'Thanks, Alex! That means a lot coming from you. Your guitar work on the new rock album was insane.', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
      { id: 3, senderId: 1, text: 'We should jam sometime!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: 4, senderId: 2, text: 'Definitely! I\'ll be in NY next month, I\'ll hit you up.', timestamp: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString() },
    ]
  },
    {
    id: '1-18',
    participantIds: [1, 18],
    messages: [
       { id: 1, senderId: 1, text: 'Hey Hanna, saw your profile. Your techno tracks are killer. Ever thought of adding some atmospheric guitar textures?', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
       { id: 2, senderId: 18, text: 'Alex, that\'s an interesting idea. I\'m always open to experimenting. Send me a sample of what you have in mind.', timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
    ]
  },
  {
    id: '1-4',
    participantIds: [1, 4],
    messages: [
      { id: 1, senderId: 4, text: 'Hi Alex, I saw you\'re into experimental stuff too. I\'m a cellist working with loop pedals. Thought we could create something cool.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 2, senderId: 1, text: 'Eleanor, that sounds awesome! A guitar and an electric cello could be a wild combination. I\'m in.', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  },
  {
    id: '1-3',
    participantIds: [1, 3],
    messages: [
       { id: 1, senderId: 3, text: 'Yo, your profile says you\'re a pro rock guitarist. My funk band is looking to add some more rock edge. Interested in a session?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  }
];
