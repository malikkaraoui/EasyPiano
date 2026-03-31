import { describe, expect, it } from "vitest";

import { __pianoMotion } from "./PianoKeys";

describe("PianoKeys motion", () => {
  it("fait se chevaucher les deux mains sur certaines attaques", () => {
    const sampledMoments = Array.from(
      { length: 80 },
      (_, index) => index * 250,
    );

    const overlappingMoments = sampledMoments.filter((timeMs) => {
      const state = __pianoMotion.getPressedKeysAtTime(timeMs);

      return state.leftHandCount > 0 && state.rightHandCount > 0;
    });

    expect(overlappingMoments.length).toBeGreaterThan(0);
  });

  it("joue parfois plusieurs touches en même temps", () => {
    const sampledMoments = Array.from(
      { length: 80 },
      (_, index) => index * 250,
    );

    const denseMoment = sampledMoments.find((timeMs) => {
      const state = __pianoMotion.getPressedKeysAtTime(timeMs);

      return state.pressedWhiteKeys.length + state.pressedBlackKeys.length >= 4;
    });

    expect(denseMoment).toBeTypeOf("number");
  });

  it("varie les phrases d'un cycle à l'autre de manière déterministe", () => {
    const cycleIndexes = Array.from({ length: 8 }, (_, index) => index);
    const phraseIndexes = cycleIndexes.map(__pianoMotion.getPhraseIndex);

    expect(new Set(phraseIndexes).size).toBeGreaterThan(1);
    expect(__pianoMotion.getPhraseIndex(3)).toBe(
      __pianoMotion.getPhraseIndex(3),
    );
  });

  it("garde une intensité déterministe pour une touche à un instant donné", () => {
    const sampledMoments = Array.from(
      { length: 80 },
      (_, index) => index * 250,
    );
    const activeMoment = sampledMoments.find(
      (timeMs) => __pianoMotion.getKeyPressStrength(timeMs, 31, true) > 0,
    );

    expect(activeMoment).toBeTypeOf("number");

    const firstSample = __pianoMotion.getKeyPressStrength(
      activeMoment,
      31,
      true,
    );
    const secondSample = __pianoMotion.getKeyPressStrength(
      activeMoment,
      31,
      true,
    );

    expect(firstSample).toBe(secondSample);
    expect(firstSample).toBeGreaterThan(0);
  });
});
