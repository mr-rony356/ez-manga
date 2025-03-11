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
import { LogsDashboardContext } from './Context'

const SubscriptionsPagination = () => {
  const { page, setPage, lastPage } = useContext(LogsDashboardContext)

  return (
    <>
      <Pagination className="gap-x-2">
        <PaginationContent>
          <PaginationItem data-has-previous={page !== 1 ? true : false}>
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
          <PaginationItem data-has-next={page < lastPage ? true : false}>
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
export default SubscriptionsPagination
