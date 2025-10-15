import { chromium, type Browser } from 'playwright'

let browserPromise: Promise<Browser> | null = null

// Lazy-load browser once and reuse it across all requests
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none'
      ]
    })
  }
  return browserPromise
}

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await getBrowser()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.setContent(html, { waitUntil: 'networkidle' })
    await page.evaluateHandle('document.fonts.ready')
    // await page.waitForTimeout(300) // give extra buffer

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' }
    })

    return pdf
  } catch (err) {
    console.error('PDF generation failed:', err)
    throw err
  } finally {
    // Always close the context & page to free memory
    await context.close()
  }
}
