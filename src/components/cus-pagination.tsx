import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext } from '@/components/ui/pagination'

export function CusPagination({
  showPreviousNext = true,
  totalPage = 0,
  currentPage = 1,
  onPageChange,
}: {
  showPreviousNext?: boolean
  totalPage: number
  currentPage: number
  onPageChange: (page: number) => void
}) {
  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPage
          ? (
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage - 1 < 1}
                >
                  <ChevronLeft />
                </Button>
              </PaginationItem>
            )
          : null}
        {generatePaginationLinks(currentPage, totalPage, onPageChange)}
        {showPreviousNext && totalPage
          ? (
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage > totalPage - 1}
                >
                  <ChevronRight />
                </Button>
              </PaginationItem>
            )
          : null}
      </PaginationContent>
    </Pagination>
  )
}

function generatePaginationLinks(currentPage: number, totalPage: number, onPageChange: (page: number) => void) {
  const pages: JSX.Element[] = []
  if (totalPage <= 6) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }
  }
  else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }
    if (currentPage > 2 && currentPage < totalPage - 1) {
      pages.push(
        <PaginationItem key="p-ellipsis-prev">
          <PaginationEllipsis />
        </PaginationItem>,
      )
      pages.push(
        <PaginationItem key="p-current">
          <PaginationLink
            onClick={() => onPageChange(currentPage)}
            isActive
            className="cursor-pointer"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>,
      )
    }
    pages.push((
      <PaginationItem key="p-ellipsis-next">
        <PaginationEllipsis />
      </PaginationItem>
    ))
    for (let i = totalPage - 1; i <= totalPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }
  }
  return pages
}
