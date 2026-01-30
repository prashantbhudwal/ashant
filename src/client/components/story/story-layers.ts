import { LEVEL, type Story, type StorySubplot } from './types'

type StoryLike = Story | StorySubplot

export function getStoryParagraphs(
  story: StoryLike,
  resolution: number,
): string[] {
  const blocks: string[] = [story.layers.l1.text]

  const layer2 = story.layers.l2?.text
  const layer3 = story.layers.l3?.text

  if (resolution >= LEVEL.basic.value) {
    if (layer2) {
      blocks.push(layer2)
    } else if (layer3 && resolution < LEVEL.detailed.value) {
      blocks.push(layer3)
    }
  }

  if (resolution >= LEVEL.detailed.value && layer3) {
    blocks.push(layer3)
  }

  return blocks
}
