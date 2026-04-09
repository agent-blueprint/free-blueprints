import type { Blueprint, BlueprintCatalogEntry } from '../types.js';
import { rfxProcurement } from './rfx-procurement/index.js';
import { employeeOnboarding } from './employee-onboarding/index.js';

const blueprints: Blueprint[] = [
  rfxProcurement,
  employeeOnboarding,
];

const blueprintMap = new Map<string, Blueprint>(
  blueprints.map((bp) => [bp.catalog.id, bp])
);

export function getCatalog(): BlueprintCatalogEntry[] {
  return blueprints.map((bp) => bp.catalog);
}

export function getBlueprint(id: string): Blueprint | undefined {
  return blueprintMap.get(id);
}
