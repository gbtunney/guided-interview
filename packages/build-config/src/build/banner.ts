export interface PackageMeta {
    name: string
    version: string
    description?: string
    license?: string
    author?: { name?: string } | string
    repository?: { url?: string } | string
}

const getAuthorName = (author: PackageMeta['author']): string => {
    if (!author) return ''
    if (typeof author === 'string') return author
    return author.name ?? ''
}

const getRepoUrl = (repository: PackageMeta['repository']): string => {
    if (!repository) return ''
    if (typeof repository === 'string') return repository
    return repository.url ?? ''
}

export const getBanner = (
    libraryName: string,
    pkg: PackageMeta,
): string => {
    const year = new Date().getFullYear()
    const author = getAuthorName(pkg.author)
    const repo = getRepoUrl(pkg.repository)
    const lines = [
        `/*`,
        ` * ${pkg.name} v${pkg.version}`,
        ` * Module: ${libraryName}`,
        author ? ` * (c) ${year} - ${author}` : null,
        pkg.description ? ` * Description: ${pkg.description}` : null,
        repo ? ` * Github: ${repo}` : null,
        pkg.license ? ` * Released under the ${pkg.license} License.` : null,
        ` * Build: ${new Date().toLocaleString()}`,
        ` */`,
    ].filter(Boolean)
    return lines.join('\n')
}
