import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { PaginationMetadata } from "../types/ApiResponse";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePageSizeParam } from "../hooks/usePageSizeParam";

type PaginationProps = {
  // setPage: Dispatch<SetStateAction<number>>;
  // pageSize: number;
  // setPageSize: Dispatch<SetStateAction<number>>;
  paginationMetadata: PaginationMetadata;
  defaultPageSize?: number;
  rowsPerPageOptions?: number[];
};

export const Pagination = ({ paginationMetadata, defaultPageSize, rowsPerPageOptions }: PaginationProps) => {
  const [, setSearchParams] = useSearchParams();

  const pageSize = usePageSizeParam(defaultPageSize);
  const [first, setFirst] = useState(0);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    // setPage(event.page);
    setFirst(event.first);
    // setPageSize(event.rows);

    setSearchParams({
      page: (event.page + 1).toString(),
      pageSize: event.rows.toString(),
    });
  };

  return (
    <Paginator
      first={first}
      rows={pageSize}
      totalRecords={paginationMetadata?.totalElements}
      rowsPerPageOptions={rowsPerPageOptions ?? [10, 20, 30]}
      onPageChange={onPageChange}
      pt={{
        root: {
          style: { backgroundColor: "transparent", border: 0 },
        },
      }}
    />
  );
};
