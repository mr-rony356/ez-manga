"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Series } from "@/types";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { SingleSeriesContext } from "./Context";
import API from "@/services/api";
import { clear_cache, purge_cf_cache } from "@/lib/actions";

const WEEK_DAYS: string[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const seriesFormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.string().nullable(),
  studio: z.string().nullable(),
  is_pinned: z.boolean(),
  is_editor_pick: z.boolean(),
  is_main: z.boolean(),
  release_year: z.string(),
  alternative_names: z.string(),
  badge: z.string(),
  nu_link: z.string().nullable(),
  discord_role_id: z.string().nullable().optional(),
  release_schedule: z.custom<Series["release_schedule"]>((value) => {
    if (!value) return false;
    if (typeof value !== "object") return false;
    for (const field in value) {
      if (!WEEK_DAYS.includes(field)) return false;
    }
    return true;
  }).optional(),
});

export type SeriesFormValues = z.infer<typeof seriesFormSchema>;

const FormContextProvider = ({ children }: { children: ReactNode }) => {
  const { series, adult, visibility, type, status, coming_soon } =
    useContext(SingleSeriesContext);

  const methods = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesFormSchema),
    mode: "onChange",
    defaultValues: {
      id: series.id.toString(),
      title: series.title,
      description: series.description,
      author: series.author,
      badge: series.badge,
      release_year: series.release_year,
      alternative_names: series.alternative_names,
      studio: series.studio,
      nu_link: series.nu_link,
      release_schedule: series.release_schedule,
      is_pinned: series.is_pinned,
      is_editor_pick: series.is_editor_pick,
      discord_role_id: series.discord_role_id,
      is_main: series.is_main

    },
  });

  async function onSubmit(data: SeriesFormValues) {
    const payload = {
      ...data,
      adult,
      visibility,
      status,
      series_type: type,
      is_coming_soon: coming_soon,
    };
    await API.put("/series/update", payload);


    await Promise.all([
      clear_cache(series.series_slug),
      clear_cache("home"),
    ]);
    toast.success("Series successfully updated!");
  }

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
      </Form>
    </FormProvider>
  );
};

export default FormContextProvider;
