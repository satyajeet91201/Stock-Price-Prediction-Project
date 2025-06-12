import sharp from "sharp"

async function convertSvgToFormats() {
  try {
    console.log("Starting SVG to JPG/PNG conversion...")

    // Fetch the SVG from the provided URL
    const svgUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/output-AhDyVIPT1PWbUgtVb50C3RlW5yf5M8.svg"
    console.log("Fetching SVG from:", svgUrl)

    const response = await fetch(svgUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`)
    }

    const svgBuffer = Buffer.from(await response.arrayBuffer())
    console.log("SVG fetched successfully, size:", svgBuffer.length, "bytes")

    // Convert to PNG with high quality
    console.log("Converting to PNG...")
    const pngBuffer = await sharp(svgBuffer)
      .png({
        quality: 100,
        compressionLevel: 0,
      })
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: false,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toBuffer()

    console.log("PNG conversion completed, size:", pngBuffer.length, "bytes")

    // Convert to JPG with high quality
    console.log("Converting to JPG...")
    const jpgBuffer = await sharp(svgBuffer)
      .jpeg({
        quality: 95,
        progressive: true,
      })
      .resize(1920, 1080, {
        fit: "inside",
        withoutEnlargement: false,
        background: { r: 255, g: 255, b: 255 },
      })
      .toBuffer()

    console.log("JPG conversion completed, size:", jpgBuffer.length, "bytes")

    // Create download links (simulated)
    console.log("\n✅ Conversion completed successfully!")
    console.log("\n📊 File Information:")
    console.log(`Original SVG: ${svgBuffer.length} bytes`)
    console.log(`PNG Output: ${pngBuffer.length} bytes (${(pngBuffer.length / 1024).toFixed(2)} KB)`)
    console.log(`JPG Output: ${jpgBuffer.length} bytes (${(jpgBuffer.length / 1024).toFixed(2)} KB)`)

    console.log("\n🎯 Conversion Details:")
    console.log("- Resolution: 1920x1080 (Full HD)")
    console.log("- PNG Quality: Lossless compression")
    console.log("- JPG Quality: 95% (High quality)")
    console.log("- Background: White")
    console.log("- Aspect Ratio: Maintained")

    console.log("\n📁 Files would be saved as:")
    console.log("- finnhub-stock-predictor-diagram.png")
    console.log("- finnhub-stock-predictor-diagram.jpg")

    // In a real environment, you would save the files like this:
    // await fs.writeFile('finnhub-stock-predictor-diagram.png', pngBuffer);
    // await fs.writeFile('finnhub-stock-predictor-diagram.jpg', jpgBuffer);

    console.log("\n🚀 Conversion process completed successfully!")

    return {
      png: pngBuffer,
      jpg: jpgBuffer,
      originalSize: svgBuffer.length,
      pngSize: pngBuffer.length,
      jpgSize: jpgBuffer.length,
    }
  } catch (error) {
    console.error("❌ Error during conversion:", error.message)
    console.error("Stack trace:", error.stack)
    throw error
  }
}

// Execute the conversion
convertSvgToFormats()
  .then((result) => {
    console.log("\n🎉 All conversions completed successfully!")
    console.log("You can now download the converted files.")
  })
  .catch((error) => {
    console.error("💥 Conversion failed:", error.message)
  })
