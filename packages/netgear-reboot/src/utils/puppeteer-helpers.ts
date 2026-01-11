import { Browser, Credentials, Page } from 'puppeteer'

export const authenticate = async (
    browser: Browser,
    url: string,
    credentials: Credentials,
): Promise<Page | false> => {
    const page = await browser.newPage()
    await page.authenticate(credentials)
    await page.goto(`${url}/reboot_pg.htm`, { waitUntil: 'networkidle0' })
    const redirectedUrl = page.url()
    if (redirectedUrl.includes('401_access_denied.htm')) {
        return false
    }
    return page
}
