import type { GenerationRequest, VisualDirectionConfig } from "@archetype-studio/core";

import { visualDirections } from "./directions.js";

export function selectVisualDirection(request: GenerationRequest): VisualDirectionConfig {
  if (request.visualDirectionId) {
    return getVisualDirectionConfig(request.visualDirectionId);
  }

  const topic = `${request.topic} ${request.audience ?? ""}`.toLowerCase();

  if (matchesAny(topic, ["texter", "texting", "group chat", "dm", "phone"])) {
    return getVisualDirectionConfig("messy-phone-collage");
  }

  if (matchesAny(topic, ["reader", "academic", "book", "study", "philosopher"])) {
    return getVisualDirectionConfig("academic-margins");
  }

  if (matchesAny(topic, ["programming", "programmer", "language", "code", "terminal"])) {
    return getVisualDirectionConfig("terminal-core");
  }

  if (matchesAny(topic, ["music", "shoegaze", "band", "album", "listener"])) {
    return getVisualDirectionConfig("dreamy-music-mag");
  }

  return getVisualDirectionConfig("soft-sticker-board");
}

export function getVisualDirectionConfig(id: string): VisualDirectionConfig {
  const direction = visualDirections.find((candidate) => candidate.id === id);

  if (!direction) {
    throw new Error(`Unknown visual direction: ${id}`);
  }

  return direction;
}

function matchesAny(input: string, needles: string[]): boolean {
  return needles.some((needle) => input.includes(needle));
}
