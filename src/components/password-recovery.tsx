'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import API from '@/services/api'
import { useState } from 'react'
import { toast } from 'sonner'
const PasswordRecoveryDialog = () => {
  const [email, setEmail] = useState<string>('')

  async function sendPasswordReset() {
    if (email === '') return toast.error('Please, insert your email.')
    toast.promise(API.post('/recover', { email }), {
      success: 'We sent you an email with a link to reset your password.',
      error: 'An error occurred while trying to send the email.',
      loading: 'Sending email...',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">I forgot my password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-muted-foreground">
        <DialogHeader>
          <DialogTitle>Password recovery</DialogTitle>
          <DialogDescription>
            Insert your email and we will send you a link to reset your
            password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">E-mail address</Label>
            <Input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              onClick={sendPasswordReset}
              type="submit"
              className="bg-background"
            >
              Send e-mail
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default PasswordRecoveryDialog
