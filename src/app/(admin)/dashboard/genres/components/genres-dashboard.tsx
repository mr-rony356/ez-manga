'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import useSWR from 'swr';
import { fetcher } from '@/services';
import type { Tag } from '@/types';
import { deleteGenre } from "@/services";
import { toast } from 'sonner';
import AddGenreDialog from './create-genre-item';
import EditGenreDialog from './edit-genre-dialog';
import API from '@/services/api';






const GenreDashboard = () => {
  const [genres, setGenres] = useState<Tag[]>([
  ]);

  const [newGenre, setNewGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const { data, isLoading, error, mutate } = useSWR('/tags', fetcher)

  useEffect(() => {
    if (data) {
      setGenres(data)
    }

  }, [data])

  const handleUpdateGenre = async (id: string, data: any) => {
    toast.promise(API.put('/tags', {
      id,
      ...data
    }), {
      success: 'Genre updated successfully',
    })
    mutate()

  }

  const handleDeleteGenre = async (id: any) => {
    toast.promise(deleteGenre(id.toString()), {
      success: 'Genre deleted successfully',
    })
    mutate()
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Genres Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search genres..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">

            <AddGenreDialog />

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {genres.map(genre => (
            <Card
              key={genre.id}
              style={{
                borderLeft: `4px solid ${genre.color || '#000000'}`,
              }}
              className={`relative overflow-hidden border-l-4`}
            >
              <CardContent className="p-4">

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{genre.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {genre.meta.series_count} titles
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <EditGenreDialog tag={genre} onUpdateGenre={handleUpdateGenre} />
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
                            {`Are you sure you want to delete "{genre.name}"? This action cannot be undone.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteGenre(genre.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenreDashboard;