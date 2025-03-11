"use client";
import { useContext, useState } from "react";
import { SingleSeriesContext, SingleSeriesContextType } from "./Context";
import Image from "next/image";
import { get_file_url } from "@functions";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import CoverUploader from "./CoverUploader";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import GenresSelector from "@/app/(admin)/dashboard/series/[id]/components/genres-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReleaseSchedule } from "./release-display";

const INPUT_FORM_FIELDS = [
  {
    id: "release_year",
    label: "Release year",
    type: "text",
  },
  {
    id: "badge",
    label: "Badge",
    type: "text",
  },
  {
    id: "author",
    label: "Author",
    type: "text",
  },
  {
    id: "studio",
    label: "Studio",
    type: "text",
  },
  {
    id: "alternative_names",
    label: "Alternative names",
    type: "text",
  },
];

const SELECT_FORM_FIELDS = [
  {
    id: "status",
    label: "Status",
    options: [
      {
        name: "Ongoing",
        value: "Ongoing",
      },
      {
        name: "Completed",
        value: "Completed",
      },
      {
        name: "Dropped",
        value: "Dropped",
      },
      {
        name: "Hiatus",
        value: "Hiatus",
      },
    ],
  },
  {
    id: "visibility",
    label: "Visibility",
    options: [
      {
        name: "Public",
        value: "Public",
      },
      {
        name: "Private",
        value: "Private",
      },
    ],
  },
  {
    id: "series_type",
    label: "Series Type",
    options: [
      {
        name: "Comic",
        value: "Comic",
      },
      {
        name: "Novel",
        value: "Novel",
      },
    ],
  },
];

const SingleSeriesHeader = () => {
  const form = useFormContext();

  const {
    series,
    adult,
    setAdult,
    status,
    setStatus,
    visibility,
    setVisibility,
    type,
    setType,
    coming_soon,
    setComingSoon,
  } = useContext(SingleSeriesContext);

  return (
    <div className="grid grid-cols-12 pt-3 gap-y-3 gap-x-3">
      <div className="col-span-12 bg-background lg:col-span-9 space-y-3 rounded p-6 order-2 lg:order-1">
        <input type="hidden" name="id" value={series.id.toString()} />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Title of the series..."
                  className="text-foreground font-bold"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nu_link"
          render={({ field: { value, ...rest } }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Novel update link of the series"
                  className="text-muted-foreground"
                  value={value || ""}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discord_role_id"
          render={({ field: { value, ...rest } }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Discord Role ID"
                  className="text-muted-foreground"
                  value={value || ""}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} className="h-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_pinned"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground ml-4">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="is_pinned"
                  />
                  <Label htmlFor="is_pinned">Is pinned?</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_main"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground ml-4">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="is_pinned"
                  />
                  <Label htmlFor="is_pinned">Is on main slider?</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_editors_pick"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground ml-4">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="is_editors_pick"
                  />
                  <Label htmlFor="is_editors_pick">Editor's Pick</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ReleaseSchedule />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
          <Select
            defaultValue={status}
            onValueChange={(e) =>
              setStatus(e as SingleSeriesContextType["status"])
            }
          >
            <SelectTrigger>
              <SelectValue
                className="bg-gray-400"
                placeholder="Series Status"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Series Status</SelectLabel>
                {SELECT_FORM_FIELDS[0].options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue={visibility}
            onValueChange={(e) =>
              setVisibility(e as SingleSeriesContextType["visibility"])
            }
          >
            <SelectTrigger>
              <SelectValue className="bg-gray-400" placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Series type</SelectLabel>
                {SELECT_FORM_FIELDS[1].options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue={type}
            onValueChange={(e) => setType(e as SingleSeriesContextType["type"])}
          >
            <SelectTrigger>
              <SelectValue className="bg-gray-400" placeholder="Series type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Series type</SelectLabel>
                {SELECT_FORM_FIELDS[2].options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {INPUT_FORM_FIELDS.map((form_field) => (
            <FormField
              control={form.control}
              key={form_field.id}
              name={form_field.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    {form_field.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={form_field.type}
                      placeholder={form_field.label}
                      className="text-foreground font-bold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <div className="flex items-center justify-center space-x-2 text-muted-foreground ml-4">
            <Switch
              checked={adult}
              onCheckedChange={(e) => setAdult(e)}
              id="adult"
            />
            <Label htmlFor="adult">Adult series</Label>
          </div>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground ml-4">
            <Switch
              checked={coming_soon}
              onCheckedChange={(e) => setComingSoon(e)}
              id="coming_soon"
            />
            <Label htmlFor="adult">Coming soon?</Label>
          </div>
          <GenresSelector />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3 relative flex justify-center self-start w-full order-1 lg:order-2">
        <div className="space-y-2 w-full">
          <CoverUploader />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 rounded text-foreground w-full"
          >
            Update series
          </button>
        </div>
      </div>
    </div>
  );
};
export default SingleSeriesHeader;
