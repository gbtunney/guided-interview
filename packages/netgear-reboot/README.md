# @snailicide/netgear-reboot 🐌

[![NPM](https://img.shields.io/npm/v/@snailicide/netgear-reboot)](http://www.npmjs.com/package/@snailicide/netgear-reboot)
![License: MIT](https://img.shields.io/npm/l/@snailicide/netgear-reboot)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

_Provides repository with base configurations that can be extended in new
packages._

---

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![ESLint](https://img.shields.io/badge/Puppeteer-orange?style=for-the-badge&logo=eslint&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

### Repository

- **Github:** [`gbt-monoorepo`](https://github.com/gbtunney/gbt-monorepo) •
  [`snailicide-monorepo`](https://github.com/gbtunney/snailicide-monorepo.git)

### Author

👤 **Gillian Tunney**

- [github](https://github.com/gbtunney)
- [email](mailto:gbtunney@mac.com)

> Recommended package manager is [pnpm](http://pnpm.io)
>
> [![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](http://pnpm.io)

## Installation

```shell
# pnpm
$ pnpm add @snailicide/build-config -D

# yarn
$ yarn add @snailicide/build-config -D

# npm
$ npm install @snailicide/build-config --development
```

_**OR:**_

```shell
# install in workspace
git clone https://github.com/gbtunney/gbt-boilerplate.git ./packages/gbt-boilerplate
rm -rf ./packages/gbt-boilerplate/.git
pnpm install

# run delete files script
pnpm --filter=gbt-boilerplate build:ts
pnpm --filter=gbt-boilerplate exec node ./workspace.mjs
```

## Examples

```sh
                  _                                                         _                       _
  _ __     ___  | |_    __ _    ___    __ _   _ __           _ __    ___  | |__     ___     ___   | |_
 | '_ \   / _ \ | __|  / _` |  / _ \  / _` | | '__|  _____  | '__|  / _ \ | '_ \   / _ \   / _ \  | __|
 | | | | |  __/ | |_  | (_| | |  __/ | (_| | | |    |_____| | |    |  __/ | |_) | | (_) | | (_) | | |_
 |_| |_|  \___|  \__|  \__, |  \___|  \__,_| |_|            |_|     \___| |_.__/   \___/   \___/   \__|
                       |___/
__________________________________________

Netgear does not provide a cli command for rebooting this router so this is an a
ttempted workaround

$ netgear-reboot [args]

Options:
      --headless  Headless                             [boolean] [default: true]
      --url       Url                   [string] [default: "http://192.168.1.1"]
  -h, --help      Show help                                            [boolean]
  -p, --password  Password [required]                                   [string]
  -u, --user      User                                                  [string]
  -v, --version   Show version number                                  [boolean]

Examples:
  netgear-reboot --headless false  Start in non-headless mode
```

## Helpful Links

- [Puppeteer](https://pptr.dev/)
