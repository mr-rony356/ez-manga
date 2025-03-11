"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Series } from "@/types";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

export type SingleSeriesContextType = {
  series: Series;
  adult: boolean;
  setAdult: Dispatch<SetStateAction<boolean>>;
  type: "Comic" | "Novel";
  setType: Dispatch<SetStateAction<SingleSeriesContextType["type"]>>;
  visibility: "Public" | "Private";
  setVisibility: Dispatch<
    SetStateAction<SingleSeriesContextType["visibility"]>
  >;
  status: "Ongoing" | "Completed" | "Dropped" | "Hiatus";
  setStatus: Dispatch<SetStateAction<SingleSeriesContextType["status"]>>;
  coming_soon: boolean;
  setComingSoon: Dispatch<SetStateAction<boolean>>;
};

export const SingleSeriesContext = createContext({} as SingleSeriesContextType);

export const SingleSeriesContextProvider = ({
  series,
  children,
}: {
  series: Series;
  children: ReactNode;
}) => {
  const [type, setType] = useState<SingleSeriesContextType["type"]>(
    series.series_type
  );
  const [status, setStatus] = useState<SingleSeriesContextType["status"]>(
    series.status
  );
  const [visibility, setVisibility] = useState<
    SingleSeriesContextType["visibility"]
  >(series.visibility as "Public" | "Private");
  const [adult, setAdult] = useState<SingleSeriesContextType["adult"]>(
    series.adult
  );
  const [coming_soon, setComingSoon] = useState<boolean>(series.is_coming_soon);

  return (
    <SingleSeriesContext.Provider
      value={{
        series,
        status,
        setStatus,
        type,
        setType,
        coming_soon,
        setComingSoon,
        adult,
        setAdult,
        visibility,
        setVisibility,
      }}
    >
      {children}
    </SingleSeriesContext.Provider>
  );
};
