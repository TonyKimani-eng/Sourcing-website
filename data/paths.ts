const repositoryName = "Sourcing-website";

export const siteBasePath =
  process.env.NEXT_PUBLIC_SITE_BASE_PATH ??
  (process.env.GITHUB_PAGES === "true" ? `/${repositoryName}` : "");

export function assetPath(path: string) {
  return `${siteBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function routePath(path: string) {
  if (path === "/") {
    return siteBasePath || "/";
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const trailingPath = normalizedPath.endsWith("/")
    ? normalizedPath
    : `${normalizedPath}/`;

  return `${siteBasePath}${trailingPath}`;
}
