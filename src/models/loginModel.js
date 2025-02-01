const pool = require("../config/database");

const words = [
  // ⭐ Marvel & DC 히어로들
  "IronMan",
  "Thor",
  "Loki",
  "Hulk",
  "Spidey",
  "Deadpool",
  "DoctorStrange",
  "StarLord",
  "Wolverine",
  "Magneto",
  "Groot",
  "Thanos",
  "BlackPanther",
  "RocketRaccoon",
  "Venom",
  "Hawkeye",
  "AntMan",
  "SilverSurfer",
  "Cyclops",
  "Gambit",
  "MoonKnight",
  "Daredevil",
  "GreenLantern",
  "Aquaman",
  "Joker",
  "Bane",
  "Flash",
  "Shazam",
  "Rorschach",
  "Mystique",

  // 🔥 포켓몬스터
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Gengar",
  "Jigglypuff",
  "Snorlax",
  "Meowth",
  "Eevee",
  "Mewtwo",
  "Magikarp",
  "Ditto",
  "Lucario",
  "Rayquaza",
  "Blastoise",
  "Gyarados",
  "Dragonite",
  "Arceus",
  "Garchomp",
  "Metagross",
  "Slowpoke",
  "Togepi",

  // 🃏 유희왕
  "DarkMagician",
  "BlueEyes",
  "Exodia",
  "Slifer",
  "Ra",
  "Obelisk",
  "Kuriboh",
  "TimeWizard",
  "RedEyes",
  "Jinzo",
  "SummonedSkull",
  "ToonDragon",
  "BusterBlader",
  "ChaosSoldier",
  "CyberDragon",
  "ElementalHero",
  "AncientGear",
  "Neos",
  "Relinquished",
  "OjamaKing",

  // 🦾 디지몬
  "Agumon",
  "Gabumon",
  "Patamon",
  "Greymon",
  "MetalGarurumon",
  "WarGreymon",
  "Omnimon",
  "Beelzemon",
  "Devimon",
  "Leomon",
  "Veemon",
  "Angemon",
  "Diaboromon",
  "Imperialdramon",
  "Piedmon",
  "Gatomon",
  "Machinedramon",
  "Etemon",
  "Lillymon",
  "Terriermon",

  // 🤣 웃긴 이름
  "CaptainBacon",
  "TofuKnight",
  "NoodleKing",
  "ProfessorMeme",
  "SirLagsalot",
  "CheeseWizard",
  "DrWaffles",
  "SpaghettiLord",
  "PancakeSamurai",
  "BobaFettucine",
  "Shrekonomics",
  "TacoDestroyer",
  "WaluigiTime",
  "PickleRick",
  "BongoCat",
  "DankMemeLord",
  "CabbageAvenger",
  "ChonkyCat",
  "PenguinOverlord",
  "BurritoMaster",
];

const insertUser = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO buildblock.user
      ( eoa, nickname, created_at, updated_at)
      VALUES( ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;

    const values = [data.ethereum_address, data.nickname];

    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

module.exports = {
  words,
  insertUser,
};
