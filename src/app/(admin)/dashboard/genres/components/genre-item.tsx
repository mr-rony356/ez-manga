'use client';
import { Button } from "@/components/ui/button"
import { Tag } from "@/types"
import { deleteGenre } from "@/services";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type GenreItemProps = {
    tag: Tag
}

export const GenreItem = ({ tag }: GenreItemProps) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(tag.name);

    async function handleDelete() {
        await deleteGenre(tag.id.toString())
        router.refresh()
    }

    async function handleEdit() {
        if (editName.trim() && editName !== tag.name) {
            // Assuming you have an updateGenre service
            // await updateGenre(tag.id.toString(), { ...tag, name: editName.trim() })
            setIsEditing(false);
            router.refresh()
        }
    }

    return (
        <Card style={{ borderLeft: `4px solid ${tag.color || '#000000'}` }}>
            <CardHeader>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                        />
                        <Button variant="ghost" size="icon" onClick={handleEdit}>
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>{tag.name}</CardTitle>
                            {tag.description && (
                                <p className="text-sm text-muted-foreground">{tag.description}</p>
                            )}
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Genre</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {`Are you sure you want to delete "${tag.name}"? This action cannot be undone.`}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default GenreItem;