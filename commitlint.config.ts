/**
 * @file Commitlint configuration for the Monorepo.
 * @author Gillian Tunney
 * @see [commitlint - Lint commit messages](https://commitlint.js.org/#/)
 */
import { commitlint, CommitlintUserConfig } from '@snailicide/build-config'

const Configuration: CommitlintUserConfig = commitlint.configuration([
    'root',
    '@snailicide/netgear-reboot',
    '@gbt/tuya-device',
    '@gbt/google-calendar-util',
    '@gbt/example-package',
    'home-assistant',
    'todo:fix disable scope',
])

export default Configuration
