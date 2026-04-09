/**
 * A single file within a blueprint manifest.
 */
export interface BlueprintFile {
  path: string;
  content: string;
}

/**
 * Full blueprint manifest returned by get_blueprint.
 * Matches the paid server's download_blueprint output schema.
 */
export interface BlueprintManifest {
  directory: string;
  files: BlueprintFile[];
  installHint: string;
}

/**
 * Catalog entry returned by list_blueprints.
 */
export interface BlueprintCatalogEntry {
  id: string;
  title: string;
  description: string;
  agentCount: number;
  pattern: string;
  category: string;
}

/**
 * A complete blueprint definition including catalog metadata and file content.
 */
export interface Blueprint {
  catalog: BlueprintCatalogEntry;
  manifest: BlueprintManifest;
}
