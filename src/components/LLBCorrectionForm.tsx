import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import sendLLBCorrectionForm from "@/actions/sendLLBCorrectionForm";
import {
  llbCorrectionFormSchema,
  LLBCorrectionFormSchemaType,
} from "@/utils/validationLLBCorrectionForm";
import { toast } from "sonner";
import type { BibleWithLLB } from "@/types";

export default function LLBCorrectionForm({
  word,
  setIsLLBCorrectionDrawerOpen,
}: {
  word: BibleWithLLB;
  setIsLLBCorrectionDrawerOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<LLBCorrectionFormSchemaType>({
    resolver: zodResolver(llbCorrectionFormSchema),
    defaultValues: {
      name: "test",
      email: "test@test.com",
      correctedGloss: word?.llbword.gloss,
    },
  });

  // form.setValue('correctedGloss', word?.llbword.gloss)
  form.setValue("originalGloss", word?.llbword.gloss);

  const onSubmit: SubmitHandler<LLBCorrectionFormSchemaType> = async (
    values,
  ) => {
    setIsLLBCorrectionDrawerOpen(false);
    toast.loading("Envoi de la correction...", {
      id: "loading",
      style: { background: "white" },
    });
    const result = await sendLLBCorrectionForm(values, word);
    toast.dismiss("loading");

    if (result.success) {
      toast.success("Bien reçu! Merci pour votre correction.");
    } else {
      toast.error(`Oups! Une erreur est survenue.`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse courriel</FormLabel>
              <FormControl>
                <Input placeholder="Adresse courriel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correctedGloss"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Définition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Envoyer
        </Button>
      </form>
    </Form>
  );
}
