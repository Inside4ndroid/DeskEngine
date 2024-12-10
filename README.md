# An application to customise your desktop!

Hello! I'm Inside4ndroid, a passionate Software Developer. I love solving problems and recently i have been tinkering with my desktop.

- 🐛 Bugs will be found and squashed as soon as possible please report any isues.
- 🌱 Currently in a state that works.

---

## Sponsorship / Donations

Your sponsorship is vital in helping me achieve this mission. With your support, I can:

Dedicate more time to developing and improving my projects
Cover costs for essential tools, services and premium hosting to run public projects
Provide detailed documentation and support for users
Every contribution, no matter the size, makes a significant impact.

[Sponsor Me!](https://github.com/sponsors/Inside4ndroid)

Thank you for considering supporting my work!

# Features

- Create Plugin's for your desktop using html, css and javascript.
- Load / Unload Plugin's at will with a simple GUI.
- Load Desktop wallpapers like never before with support for video and image aswell as Gif.
- Comes with a default Plugin which shows the date and time.
- Comes with 3 default beutiful video wallpapers.

## How To Use

Currently there is only a limited api but here is what you can currently call within your plugin's javascript.

For exmples of how to use the the below api's please see the example plugins included in the /public/Plugins/ folder.

# Date, Time Api

- await window.api.getClockInfo('getAllDateInfo'); : Returns full date object.
- await window.api.getClockInfo('getCurrentTime'); : Returns current time in format hh:mm.
- await window.api.getClockInfo('getToday'); : Returns name of current day eg, Sunday.
- await window.api.getClockInfo('getTimezone'); : Returns current timezone.
- await window.api.getClockInfo('getMonth'); : Returns the current month eg, January.
- await window.api.getClockInfo('getDayOfMonth'); : Returns day of the month eg, 25.
- await window.api.getClockInfo('getYear'); : Returns the current year eg, 2024.

# CPU Info Api

- await window.api.getCPUInfo('total_usage'); : Returns total percentile of CPU usage.

All these return there respective values so brand for example would return something like Ryzen 9 5900X 12-Core Processor.

- await window.api.getCPUInfo('manufacturer');
- await window.api.getCPUInfo('brand');
- await window.api.getCPUInfo('vendor');
- await window.api.getCPUInfo('family');
- await window.api.getCPUInfo('model');
- await window.api.getCPUInfo('stepping');
- await window.api.getCPUInfo('revision');
- await window.api.getCPUInfo('speed');
- await window.api.getCPUInfo('speedMin');
- await window.api.getCPUInfo('speedMax');
- await window.api.getCPUInfo('cores');
- await window.api.getCPUInfo('physicalCores');
- await window.api.getCPUInfo('performanceCores');
- await window.api.getCPUInfo('processors');
- await window.api.getCPUInfo('socket');
- await window.api.getCPUInfo('flags');
- await window.api.getCPUInfo('virtualization');


## Development

- Clone this repository
- Open with Visual Studio Code (or your preferred editor)
- open terminal and run
- npm install
- npm start

## Contribute

- You can contribute to the growth of this application by following the [Contribution Guide Here](https://github.com/Inside4ndroid/DeskEngine/blob/main/CONTRIBUTING.md).

## TODO

- [ ] Add and Apply new Languages.
- [ ] Add more plugins.
- [ ] Create an api for user created plugins.
- [ ] An integrated updater.
- [ ] Implement a better notification system.
- [ ] Add filters and effects for wallpapers.
- [ ] Create the About section in the application.
- [ ] Create Documentaion for the help button in the system tray.
- [ ] Add ways for the user to manipulate Windows UI Customisation.
- [ ] Add a video and/or screenshots to this repo.
- [ ] Compile and release first windows executeable / installer
- [ ] Add compatibilty for other platforms (currently only tested on win11 x64)

## NPM Dependencies Used

- electron
- electron-store
- ini 
- install
- perfmon
- systeminformation

## Get in Touch

Feel free to reach out! Let's connect and collaborate.

- Email: support@i4studio.co.uk
- Twitter: [@Inside_4ndroid](https://twitter.com/Inside_4ndroid)

---

## Hire Me!

👀 Currently FOR HIRE. If you have an interesting opportunity, I'd love to hear about it!

---

Thank you for visiting! Hope to see you again soon. 😊