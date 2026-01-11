import {
    AppConfigIn,
    initApp,
    InitSuccessCallback,
    parsePackageJson,
    WrappedSchema,
    wrapSchema,
} from '@snailicide/cli-app'
import { Credentials } from 'puppeteer'
import { z } from 'zod'
import pkg from './../../package.json'
import { doPuppeteer } from './reboot-router.js'

const USER_NAME: string = process.env['NETGEAR_USERNAME'] || 'admin'
const USER_PASS: string | undefined = process.env['NETGEAR_PASSWORD']
const ROUTER_URL: string = process.env['NETGEAR_URL'] || 'http://192.168.1.1'

const _package = parsePackageJson(pkg)

/** Define custom schema, wrapper is required to avoid typescript error */
const app_schema = wrapSchema(
    z.object({
        headless: z.boolean().default(true),
        password: z.string(),
        url: z.string().default(ROUTER_URL),
        user: z.string().default(USER_NAME),
    }),
)
type AppSchema = WrappedSchema<typeof app_schema>

/** Set the init function which will be called after app is intialized with typed arguments. */
const initFunc: InitSuccessCallback<AppSchema> = <
    Schema extends z.AnyZodObject | z.ZodEffects<z.AnyZodObject> = AppSchema,
>(
    args: z.infer<Schema>,
) => {
    if (args['user']) {
        // console.warn('RESOLVED APP ARGS: ', args)
        const CREDENTIALS: Credentials = {
            password: args['password'],
            username: args['user'],
        }
        doPuppeteer(args['url'], CREDENTIALS, {
            headless: args['headless'],
        })
        //process.exit(0)
    }
    return
}

/** Example app configuration options */
const exampleAppConfigOptions: AppConfigIn<AppSchema> = {
    description: _package ? _package.description : 'No description set',
    //code editor error
    examples: [['$0 --headless false', 'Start in non-headless mode']],
    flag_aliases: {
        help: 'h',
        password: 'p',
        user: 'u',
        version: 'v',
    },
    hidden: [],
    name: 'Netgear Reboot',
    version: _package ? _package.version : '0.0.0',
}

/** Initialize App */
export const initialize = async (): Promise<'SUCCESS' | 'ERROR'> => {
    const instance_yargs = await initApp<AppSchema>(
        app_schema,
        exampleAppConfigOptions,
        initFunc,
    )
    if (instance_yargs === undefined) {
        process.exit(1)
        return 'ERROR'
    }
    return 'SUCCESS'
}

export default initialize
