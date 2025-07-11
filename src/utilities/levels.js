
import bgDay from "../static/images/daytime.jpg";
import bgNight from "../static/images/night-time.jpg";
import bgDusk from "../static/images/dawn.jpg";
import l1 from "../static/audio/brightSong.mp3";
import l2 from "../static/audio/lev2.mp3";
import l3 from "../static/audio/lev3.mp3";

 

 const levels = [
    {
      name: "Level 1",
      background: bgDay,
      platforms: [
        { left: 0, bottom: 0, width: 300 },
        { left: 300, bottom: 40, width: 150 },
        { left: 500, bottom: 100, width: 150 },
        { left: 650, bottom: 160, width: 150 },
        { left: 800, bottom: 220, width: 150 },
        { left: 950, bottom: 280, width: 200 },
        { left: 1500, bottom: 300, width: 100 },
        { left: 1510, bottom: 360, width: 100 },
        { left: 1520, bottom: 420, width: 100 },
        { left: 1530, bottom: 480, width: 100 },
        { left: 1540, bottom: 540, width: 100 },
        { left: 1870, bottom: 540, width: 180 },
      ],
      enemies: [
        { left: 400, bottom: 60, width: 50, height: 60 },
        { left: 1000, bottom: 300, width: 50, height: 60 },
        { left: 1550, bottom: 560, width: 50, height: 60 },
      ],
      prize: { left: 2050, bottom: 540, width: 60, height: 60 },

      music: l1,
    },
    {
      name: "Level 2",
      background: bgNight,
      platforms: [
        { left: 0, bottom: 0, width: 400 },
        { left: 450, bottom: 70, width: 100 },
        { left: 600, bottom: 150, width: 120 },
        { left: 800, bottom: 200, width: 120 },
        { left: 950, bottom: 300, width: 150 },
        { left: 1200, bottom: 370, width: 150 },
        { left: 1450, bottom: 400, width: 180 },
        { left: 1800, bottom: 500, width: 160 },
      ],
      enemies: [
        { left: 650, bottom: 170, width: 50, height: 60 },
        { left: 1250, bottom: 390, width: 50, height: 60 },
        { left: 1500, bottom: 420, width: 50, height: 60 },
        { left: 1850, bottom: 520, width: 50, height: 60 },
      ],
      prize: { left: 2050, bottom: 500, width: 60, height: 60 },

      music:l2,
    },
    {
      name: "Level 3",
      background: bgDusk,
      platforms: [
        { left: 0, bottom: 0, width: 300 },
        { left: 400, bottom: 100, width: 100 },
        { left: 600, bottom: 200, width: 120 },
        { left: 800, bottom: 300, width: 100 },
        { left: 1000, bottom: 400, width: 150 },
        { left: 1200, bottom: 500, width: 80 },
        { left: 1400, bottom: 450, width: 80 },
        { left: 1600, bottom: 350, width: 80 },
        { left: 1950, bottom: 320, width: 100 },
      ],
      enemies: [
        { left: 450, bottom: 120, width: 50, height: 60 },
        { left: 850, bottom: 320, width: 50, height: 60 },
        { left: 1000, bottom: 420, width: 50, height: 60 },
        { left: 1200, bottom: 520, width: 50, height: 60 },
        { left: 1600, bottom: 370, width: 50, height: 60 },
      ],
      prize: { left: 2050, bottom: 320, width: 60, height: 60 },
      music:l3,
    },
  ];


export default levels;