const fs = require('fs')
const path = require('path')

const reactionsPath = path.join(__dirname, 'assets', 'zalo-reactions.json')
const reactionsData = JSON.parse(fs.readFileSync(reactionsPath, 'utf8'))

const emojiPosPath = path.join(__dirname, 'assets', 'zalo-emoji-pos.json')
const emojiPosData = JSON.parse(fs.readFileSync(emojiPosPath, 'utf8'))

// Extract all rIcon values from reactions data into a Set for efficient lookup
const rIconSet = new Set()
reactionsData.forEach(reaction => {
  if (reaction.rIcon) {
    rIconSet.add(reaction.rIcon)
  }
})

// Filter emoji positions that match rIcon values from reactions
const filteredData = {}
for (const [key, value] of Object.entries(emojiPosData)) {
  if (rIconSet.has(key)) {
    filteredData[key] = value
  }
}

const outputPath = path.join(__dirname, 'assets', 'zalo-reactions-emoji-pos.json')
fs.writeFileSync(outputPath, JSON.stringify(filteredData, null, 2), 'utf8')

console.log(`Filtered ${Object.keys(filteredData).length} items from ${Object.keys(emojiPosData).length} initial items.`)
console.log(`Result written to: ${outputPath}`)
