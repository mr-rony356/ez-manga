'use client'
import { Input } from '@/components/ui/input'
import { UsersDashboardContext, UsersDashboardContextType } from './Context'
import { useContext } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebounceCallback } from 'usehooks-ts'

const UsersHeader = () => {
  const { query, setQuery, orderBy, setOrderBy, role, setRole } = useContext(
    UsersDashboardContext
  )

  const debounced = useDebounceCallback(setQuery, 1000)

  return (
    <div className="flex flex-col gap-2 bg-background rounded p-5">
      <Input
        placeholder={'Search a user by name, e-mail, etc...'}
        defaultValue={query}
        onChange={(e) => debounced(e.currentTarget.value)}
      />
      <div className="flex flex-row gap-2">
        <Select defaultValue={orderBy} onValueChange={(e) => setOrderBy(e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue className="bg-gray-400" placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order by</SelectLabel>
              <SelectItem value="created_at">Created at</SelectItem>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          defaultValue={role}
          onValueChange={(e: UsersDashboardContextType['role']) => setRole(e)}
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
    </div>
  )
}
export default UsersHeader
