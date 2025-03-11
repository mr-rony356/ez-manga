'use client'
import { useContext, useState } from 'react'
import { SingleUserContext as Context } from './Context'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import ProfilePictureSelector from './ProfilePicture'
import API from '@/services/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const editUserFormSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  coins: z.string().refine((string) => typeof parseFloat(string) === 'number', {
    message: 'You inserted a string, please, enter a number.',
  }),
  password: z.string(),
})

type EditUserFormValues = z.infer<typeof editUserFormSchema>

const UserProfileForm = () => {
  const { user } = useContext(Context)

  const [role, setRole] = useState<'Reader' | 'Editor' | 'Admin'>(user.role)

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    mode: 'onChange',
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      coins: user?.coins.toString() || '',
      password: '',
    },
  })

  async function onSubmit(data: EditUserFormValues) {
    toast.promise(API.put(`/users/${user.id}`, { ...data, role }), {
      success: 'User successfully updated!',
    })
  }

  return (
    <div className="bg-background p-4 rounded">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <ProfilePictureSelector />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
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
                <FormLabel className="text-foreground">E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coins"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Coins</FormLabel>
                <FormControl>
                  <Input placeholder="Coins" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2 items-center">
            <span className="text-foreground px-4">User role</span>
            <Select
              defaultValue={role}
              onValueChange={(e: 'Reader' | 'Editor' | 'Admin') => setRole(e)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue className="bg-gray-400" placeholder="Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Reader">Reader</SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  )
}
export default UserProfileForm
