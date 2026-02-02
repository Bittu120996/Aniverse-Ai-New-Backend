import { Injectable, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GenerateAnimeImageInput,
  GenerateAnimeImageOutput,
} from './ai.interface';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // 1️⃣ TEXT PROMPT GENERATION (Gemini 2.5 Pro)
  private async buildAnimePrompt(
    animeStyle: string,
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
    });

    
const result = await model.generateContent(`
You are an elite anime art director and keyframe illustrator.

Your task is to create a SINGLE, extremely detailed image-generation prompt
that transforms a real human portrait into an authentic anime character
inside a specific anime universe.

ANIME UNIVERSE:
${animeStyle}

MAIN CHARACTER (USER):
- The user is the ONLY foreground and primary character
- Reconstruct the face as a true anime face (do NOT paste or overlay the real photo)
- Preserve exact identity: facial structure, eye spacing, nose shape, jawline, expression
- The result must look like the user was born in this anime universe
- Age appearance: adult / young-adult only

POSE & PRESENCE:
- Dynamic, cinematic pose appropriate to the anime universe
- Confident, powerful, story-driven stance
- Camera angle: dramatic anime keyframe (not a selfie)

APPEARANCE:
- Outfit, hairstyle, and accessories must match the anime universe
- Clothing should feel canonical, not cosplay
- Subtle wear, motion, and realism in fabric and hair
- Lighting must be cinematic and dramatic

SPECIAL ABILITY (VERY IMPORTANT):
- Assign ONE unique, RANDOM special ability or power
- Power must fit naturally within the anime universe
- Visually represent the power (energy, aura, effects, symbols)
- Power must enhance immersion and individuality

BACKGROUND & WORLD:
- The scene must feel like a real moment from the anime
- Canon-style background environment (city, battlefield, shrine, etc.)
- Background characters from the anime universe MAY appear
- Background characters must be:
  - Smaller
  - Secondary
  - Non-distracting
  - Clearly not the main subject

TEXT IN IMAGE (IMPORTANT):
- Display the character’s NAME and ROLE/TITLE in the image
- Typography MUST match the anime’s official style
- Text should feel like an anime title card or episode frame
- No modern fonts, no watermarks, no UI elements

SAFETY RULES:
- No sexual content
- No nudity
- No minors as the main character
- Background characters must not be sexualized
- No logos or real-world branding

STYLE & QUALITY:
- High-detail anime illustration
- Strong line work
- Rich color grading
- Depth of field (sharp foreground, softer background)
- Looks like a high-budget anime frame, not AI art

OUTPUT FORMAT:
- Return ONLY the final image-generation prompt
- No explanations
- No bullet points
- No meta text
`);


    return result.response.text();
  }

  // 2️⃣ IMAGE GENERATION (Gemini 2.5 Flash Image)
  async generateAnimeImage(
    input: GenerateAnimeImageInput,
  ): Promise<GenerateAnimeImageOutput> {
    const { userImageUrl, animeStyle } = input;

    if (!userImageUrl) {
      throw new BadRequestException('Base64 image required');
    }

    // Step A — build prompt
    const prompt = await this.buildAnimePrompt(animeStyle);

    // Step B — generate image
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: userImageUrl,
        },
      },
      prompt,
    ]);

    const imageBase64 =
      result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!imageBase64) {
      throw new Error('Image generation failed');
    }

    return {
      imageUrl: `data:image/png;base64,${imageBase64}`,
    };
  }
}
