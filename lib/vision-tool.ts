import { ImageAnnotatorClient } from '@google-cloud/vision';
import { z } from 'zod';

const visionClient = new ImageAnnotatorClient();

export const visionTool = {
  verifyHygieneImage: {
    description: 'Analyzes an image to verify a hygiene-related action, like reporting an overflowing bin.',
    parameters: z.object({
      imageUrl: z.string().url().describe('The URL of the image to analyze.'),
    }),
    execute: async ({ imageUrl }: { imageUrl: string }) => {
      try {
        const [result] = await visionClient.labelDetection(imageUrl);
        const labels =
          result.labelAnnotations?.map(label =>
            (label.description ?? '').toLowerCase()
          ) ?? [];

        // Basic verification logic
        if (labels.includes('trash') || labels.includes('waste container') || labels.includes('bin')) {
          return { isVerified: true, labels };
        } else {
          return { isVerified: false, labels };
        }
      } catch (error) {
        return { isVerified: false, error: 'Image analysis failed.' };
      }
    },
  },
};