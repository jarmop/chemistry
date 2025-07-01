// Usage: node scripts/fix_element_images.js

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../client/src/data/elements.json");
const elements = JSON.parse(fs.readFileSync(filePath, "utf8"));

function getOriginalImageUrl(thumbnailUrl) {
  // Only handle Wikimedia Commons thumbnails
  const match = thumbnailUrl.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/(?:commons|en)\/thumb\/([^/]+)\/([^/]+)\/(\d+px-)?(.+))$/,
  );
  if (!match) return null;
  // Remove '/thumb/' and the size prefix
  const [, , dir1, dir2, , filename] = match;
  return `https://upload.wikimedia.org/wikipedia/commons/${dir1}/${dir2}/${filename}`
    .split("/").slice(0, -1).join("/");
}

let changed = false;
for (const el of elements) {
  if (
    el.image && typeof el.image === "string" && el.image.includes("/thumb/")
  ) {
    // Only update if not already done
    if (!el.thumbnail) {
      el.thumbnail = el.image;
      const orig = getOriginalImageUrl(el.image);
      if (orig) {
        el.image = orig;
        changed = true;
      }
    }
  }
}

if (changed) {
  fs.writeFileSync(filePath, JSON.stringify(elements) + "\n");
  console.log("elements.json updated.");
} else {
  console.log("No changes needed.");
}
