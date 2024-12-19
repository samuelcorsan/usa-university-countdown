import { createCanvas, loadImage } from "canvas";

export async function getDominantColor(imageUrl: string): Promise<string> {
  try {
    if (!imageUrl.includes("clearbit.com")) {
      imageUrl = `https://count.nyurejects.com${imageUrl}`;
    }
    console.log("imageUrl", imageUrl);
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Load image using canvas package
    const img = await loadImage(`data:image/jpeg;base64,${base64}`);

    // Create canvas
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return "#000000";

    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorCounts: { [key: string]: number } = {};

    // Count colors
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const rgb = `${r},${g},${b}`;
      colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
    }

    // Find most common color
    let maxCount = 0;
    let dominantColor = "0,0,0";

    for (const [color, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }

    const [r, g, b] = dominantColor.split(",").map(Number);
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch (error) {
    console.error("Error getting dominant color:", error);
    return "#000000";
  }
}
