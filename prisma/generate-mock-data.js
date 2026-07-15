const fs = require('fs');
const path = require('path');

function generateMockData() {
  const data = [];
  const classes = ["1", "2", "3", "4", "5", "6"];
  const rooms = ["1", "2", "3", "4"];

  // Generate 5,000 rows
  for (let i = 1; i <= 5000; i++) {
    let studentId = String(10000 + i);
    let studentName = `นักเรียน ทดสอบ_${i}`;
    let classLevel = classes[Math.floor(Math.random() * classes.length)];
    let room = rooms[Math.floor(Math.random() * rooms.length)];
    let status = "STUDYING";

    // Inject 15% Dirty Data
    const rand = Math.random();
    if (rand < 0.05) {
      // 5% Duplicate studentId inside chunk/file
      studentId = String(10000 + Math.max(1, Math.floor(Math.random() * i)));
    } else if (rand < 0.10) {
      // 5% Empty/Missing fields
      studentId = "";
    } else if (rand < 0.15) {
      // 5% Invalid Class Levels
      classLevel = "M.999";
    }

    data.push({
      studentId,
      studentName,
      classLevel,
      room,
      status,
    });
  }

  const destPath = path.join(__dirname, 'mock_data.json');
  fs.writeFileSync(destPath, JSON.stringify(data, null, 2));
  console.log(`✅ Successfully generated 5,000 row mock dataset with 15% dirty records at ${destPath}`);
}

generateMockData();
