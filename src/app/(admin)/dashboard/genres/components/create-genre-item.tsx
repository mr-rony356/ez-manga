'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGenre, fetcher } from "@/services";
import useSWR from "swr";

interface ColorOption {
    value: string;
    label: string;
    background: string;
}

const colorOptions: ColorOption[] = [
    { value: '#FF6B6B', label: 'Red', background: 'bg-[#FF6B6B]' },
    { value: '#4ECDC4', label: 'Teal', background: 'bg-[#4ECDC4]' },
    { value: '#FFD93D', label: 'Yellow', background: 'bg-[#FFD93D]' },
    { value: '#6C5CE7', label: 'Purple', background: 'bg-[#6C5CE7]' },
    { value: '#A8E6CF', label: 'Mint', background: 'bg-[#A8E6CF]' },
    { value: '#FF8B94', label: 'Pink', background: 'bg-[#FF8B94]' },
    { value: '#98DDCA', label: 'Seafoam', background: 'bg-[#98DDCA]' },
    { value: '#FFA07A', label: 'Coral', background: 'bg-[#FFA07A]' },
];

interface FormData {
    name: string;
    description: string;
    color: string;
}

export function AddGenreDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();


    const { mutate } = useSWR('/tags', fetcher)


    const form = useForm<FormData>({
        defaultValues: {
            name: "",
            description: "",
            color: colorOptions[0].value,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createGenre({
                name: data.name,
                description: data.description,
                color: data.color,
            });
            mutate()
            setOpen(false);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error('Error creating genre:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Genre
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Genre</DialogTitle>
                    <DialogDescription>
                        Create a new genre for categorizing content. Choose a name and color to make it easily identifiable.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter genre name..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is how the genre will appear throughout the site.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter genre description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional description to provide more context about this genre.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            rules={{ required: "Color is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-4 gap-2">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => field.onChange(color.value)}
                                                    className={`
                            h-10 rounded-md border-2 transition-all
                            ${color.background}
                            ${field.value === color.value
                                                            ? 'border-primary ring-2 ring-primary ring-offset-2'
                                                            : 'border-transparent hover:border-primary/50'}
                          `}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Select a color to help identify this genre.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Create Genre</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default AddGenreDialog;