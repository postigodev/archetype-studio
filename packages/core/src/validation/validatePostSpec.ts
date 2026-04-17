import type { GenerationReport, ModeConfig, PostSpec } from "../types.js";

export function validatePostSpec(
  postSpec: PostSpec,
  modeConfig: ModeConfig
): GenerationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (postSpec.archetypes.length < modeConfig.minArchetypes) {
    errors.push(
      `Expected at least ${modeConfig.minArchetypes} archetypes, received ${postSpec.archetypes.length}.`
    );
  }

  if (postSpec.archetypes.length > modeConfig.maxArchetypes) {
    errors.push(
      `Expected at most ${modeConfig.maxArchetypes} archetypes, received ${postSpec.archetypes.length}.`
    );
  }

  if (postSpec.hook.length > modeConfig.maxTitleChars) {
    errors.push(
      `Hook exceeds max title length (${postSpec.hook.length}/${modeConfig.maxTitleChars}).`
    );
  }

  if (postSpec.caption && postSpec.caption.length > modeConfig.maxCaptionChars) {
    errors.push(
      `Caption exceeds max length (${postSpec.caption.length}/${modeConfig.maxCaptionChars}).`
    );
  }

  if (postSpec.cta && postSpec.cta.length > modeConfig.maxCtaChars) {
    errors.push(
      `CTA exceeds max length (${postSpec.cta.length}/${modeConfig.maxCtaChars}).`
    );
  }

  const normalizedNames = new Map<string, string>();
  const bulletOwners = new Map<string, string>();
  const genericNamePatterns = [
    /^the\s+(strategist|visionary|activist|leader|rebel|thinker|dreamer|fighter|organizer|outsider|ghoster|overthinker|minimalist|writer|planner|observer)$/i,
    /^(strategist|visionary|activist|leader|rebel|thinker|dreamer|fighter|organizer|outsider|ghoster|overthinker|minimalist|writer|planner|observer)$/i
  ];

  if (postSpec.namingFrame.length > 60) {
    errors.push(`Naming frame exceeds max length (${postSpec.namingFrame.length}/60).`);
  }

  for (const archetype of postSpec.archetypes) {
    const normalizedName = normalizeText(archetype.name);

    if (archetype.name.length > modeConfig.maxArchetypeNameChars) {
      errors.push(
        `Archetype "${archetype.name}" exceeds max name length (${archetype.name.length}/${modeConfig.maxArchetypeNameChars}).`
      );
    }

    if (genericNamePatterns.some((pattern) => pattern.test(archetype.name.trim()))) {
      errors.push(
        `Archetype "${archetype.name}" is too generic. Use a concrete name inside the naming frame "${postSpec.namingFrame}".`
      );
    }

    if (normalizedNames.has(normalizedName)) {
      errors.push(
        `Duplicate archetype name detected: "${archetype.name}" matches "${normalizedNames.get(normalizedName)}".`
      );
    } else {
      normalizedNames.set(normalizedName, archetype.name);
    }

    if (archetype.bullets.length < modeConfig.minBulletsPerArchetype) {
      errors.push(
        `Archetype "${archetype.name}" has too few bullets (${archetype.bullets.length}/${modeConfig.minBulletsPerArchetype}).`
      );
    }

    if (archetype.bullets.length > modeConfig.maxBulletsPerArchetype) {
      errors.push(
        `Archetype "${archetype.name}" has too many bullets (${archetype.bullets.length}/${modeConfig.maxBulletsPerArchetype}).`
      );
    }

    const seenBullets = new Set<string>();

    for (const bullet of archetype.bullets) {
      if (bullet.length > modeConfig.maxBulletChars) {
        errors.push(
          `Bullet in "${archetype.name}" exceeds max length (${bullet.length}/${modeConfig.maxBulletChars}).`
        );
      }

      const normalizedBullet = normalizeText(bullet);

      if (seenBullets.has(normalizedBullet)) {
        errors.push(`Repeated bullet detected within "${archetype.name}": "${bullet}".`);
      } else {
        seenBullets.add(normalizedBullet);
      }

      const existingOwner = bulletOwners.get(normalizedBullet);

      if (existingOwner) {
        errors.push(
          `Repeated bullet detected across archetypes: "${bullet}" appears in "${existingOwner}" and "${archetype.name}".`
        );
      } else {
        bulletOwners.set(normalizedBullet, archetype.name);
      }
    }
  }

  for (let index = 0; index < postSpec.archetypes.length; index += 1) {
    for (
      let comparisonIndex = index + 1;
      comparisonIndex < postSpec.archetypes.length;
      comparisonIndex += 1
    ) {
      const left = postSpec.archetypes[index];
      const right = postSpec.archetypes[comparisonIndex];

      if (areNamesTooSimilar(left.name, right.name)) {
        errors.push(
          `Archetype names are too similar and should be more distinct: "${left.name}" vs "${right.name}".`
        );
      }
    }
  }

  if (!postSpec.caption) {
    warnings.push("Caption is missing.");
  }

  if (!postSpec.cta) {
    warnings.push("CTA is missing.");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function areNamesTooSimilar(left: string, right: string): boolean {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);

  if (normalizedLeft === normalizedRight) {
    return true;
  }

  if (
    normalizedLeft.includes(normalizedRight) ||
    normalizedRight.includes(normalizedLeft)
  ) {
    return true;
  }

  const leftTokens = new Set(normalizedLeft.split(" ").filter(Boolean));
  const rightTokens = new Set(normalizedRight.split(" ").filter(Boolean));

  const intersectionSize = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const unionSize = new Set([...leftTokens, ...rightTokens]).size;

  if (unionSize === 0) {
    return false;
  }

  return intersectionSize / unionSize >= 0.8;
}
