import { z } from "zod";

export const llbCorrectionFormSchema = z
  .object({
    name: z.string().min(1, "Un nom est requis"),
    email: z.string().email("Une adresse courriel valide est requise"),
    correctedGloss: z.string().min(1, "Vous n'avez pas fait de modification"),
    originalGloss: z.string().min(1),
  })
  .refine((data) => data.correctedGloss !== data.originalGloss, {
    message: "Le texte n'a pas été modifié",
    path: ["correctedGloss"], // show error under correctedGloss
  });

export type LLBCorrectionFormSchemaType = z.infer<
  typeof llbCorrectionFormSchema
>;
