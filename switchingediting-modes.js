import puppeteer from 'puppeteer'

const switchEditorMode = async () => {
	let browser
	let page

	initiateTest(async () => {
		browser = await puppeteer.launch({ headless: false }) // Set to false to observe the test visually
		page = await browser.newPage()
		await page.goto('http://your-document-editor-url') // Replace with the actual URL
	})

	endTest(async () => {
		await browser.close()
	})
}

switchEditorMode()
