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
import { SeriesDashboardContext } from './Context'

const SeriesPagination = () => {
  const { page, setPage, lastPage } = useContext(SeriesDashboardContext)

  return (
    <>
      <Pagination className="gap-x-2">
        <PaginationContent>
          <PaginationItem>
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
          <PaginationItem>
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
export default SeriesPagination
