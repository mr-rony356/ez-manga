'use client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useContext } from 'react'
import { UsersDashboardContext } from './Context'

const UsersPagination = () => {
  const { page, setPage, lastPage } = useContext(UsersDashboardContext)

  return (
    <>
      <Pagination className="gap-x-2">
        <PaginationContent>
          <PaginationItem
            data-has-previous={page !== 1 ? true : false}
            className="data-[has-previous=false]:text-gray-800 data-[has-previous=true]:text-foreground data-[has-previous=true]:cursor-pointer data-[has-previous=true]:hover:text-muted-foreground bg-black rounded shadow-md"
          >
            <PaginationPrevious
              onClick={() => {
                if (page !== 1) setPage(page - 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
        <PaginationContent className="lg:hidden">
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
        <PaginationContent>
          <PaginationItem
            data-has-next={page < lastPage ? true : false}
            className="data-[has-next=false]:text-gray-800 bg-black rounded shadow-md data-[has-next=true]:hover:text-muted-foreground data-[has-next=true]:text-foreground data-[has-next=true]:cursor-pointer"
          >
            <PaginationNext
              onClick={() => {
                if (page < lastPage) setPage(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
export default UsersPagination
