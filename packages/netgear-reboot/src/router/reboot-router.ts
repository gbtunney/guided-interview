import puppeteer, { Browser, Credentials, LaunchOptions, Page } from 'puppeteer'
import { createProgressBar } from './../utils/progress-bar.js'
import { authenticate } from './../utils/puppeteer-helpers.js'

export const doPuppeteer = async (
    url: string,
    credentials: Credentials,
    options: LaunchOptions = { headless: false },
    timeout: number = 5000,
    max_time: number = 300000, // 5 minutes
): Promise<void> => {
    const browser: Browser = await puppeteer.launch(options)
    const page: Page | false = await authenticate(browser, url, credentials)

    if (!page) {
        await browser.close()
        console.error('❌ Authentication failed: access denied.')
        return
    } else {
        const progressBar = createProgressBar('Rebooting Router...')
        try {
            // Start the progress bar
            progressBar.start()
            // Navigate to the reboot page
            await page.goto(`${url}/reboot_pg.htm`, {
                timeout,
                waitUntil: 'networkidle0',
            })

            // Wait for navigation to the desired URL
            await page.waitForNavigation({
                timeout: max_time,
                waitUntil: 'networkidle0',
            })

            if (page.url() === `${url}/adv_index.htm`) {
                progressBar.stop()
                console.log(' 🚀 Navigation successful, closing browser...')
                // Close the browser
                await browser.close()
            } else {
                console.warn('❌ Navigation did not reach the expected URL.')
            }
        } catch (error: unknown) {
            progressBar.stop()
            if (error instanceof Error) {
                console.error('❌ Error:', error.message)
            } else {
                console.error('❌ An unknown error occurred.')
            }
        } finally {
            await browser.close()
        }
    }
}
