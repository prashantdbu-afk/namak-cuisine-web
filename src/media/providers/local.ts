export function resolveLocalSource(source: string) {
  if (!source.startsWith("/"))
    throw new Error("Local media sources must be root-relative.");
  return source;
}
