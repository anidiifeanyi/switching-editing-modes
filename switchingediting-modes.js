import puppeteer from 'puppeteer'

switchEditorMode(async () => {
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

	test('Verify mode switching and functionality in document editor', async () => {
		// Test Case 1: Create a new document
		await page.click('#new-document-button') // Assuming button to create a new document has this ID

		// Test Case 2: Insert a text template
		await page.click('#insert-template-button') // Assuming template button has this ID
		await page.waitForSelector('#document-content') // Wait for document to load

		// Step 3: Switch to "Reviewing" mode
		await page.click('#mode-switch-button') // Assuming the mode switch button has this ID
		await page.select('#mode-selector', 'Reviewing') // Assuming there's a mode selector to change modes

		// Step 4: Enter text and check it's recorded as a tracked change
		const reviewingText = 'This is a review change.'
		await page.type('#document-content', reviewingText)
		const trackedChange = await page.evaluate(() => {
			return (
				document.querySelector('#document-content .tracked-change')
					?.textContent || ''
			) // Assuming tracked changes are tagged with class .tracked-change
		})
		expect(trackedChange).toBe(reviewingText) // Verify that the text entered is tracked

		// Step 5: Switch to "Viewing" mode
		await page.click('#mode-switch-button')
		await page.select('#mode-selector', 'Viewing')

		// Step 6: Verify that text input is disabled
		const viewingText = 'This should not be entered.'
		await page.type('#document-content', viewingText)
		const documentContentAfterViewing = await page.evaluate(() => {
			return (
				document.querySelector('#document-content')?.textContent || ''
			)
		})
		expect(documentContentAfterViewing).not.toContain(viewingText) // The text should not be entered

		// Step 7: Switch to "Editing" mode
		await page.click('#mode-switch-button')
		await page.select('#mode-selector', 'Editing')

		// Step 8: Check that text input is enabled
		const editingText = 'This is an editing change.'
		await page.type('#document-content', editingText)
		const documentContentAfterEditing = await page.evaluate(() => {
			return (
				document.querySelector('#document-content')?.textContent || ''
			)
		})
		expect(documentContentAfterEditing).toContain(editingText) // Verify that the text is entered
	})
})
