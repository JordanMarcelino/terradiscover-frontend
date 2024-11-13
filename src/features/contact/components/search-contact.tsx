import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchContactMutation } from "../api/search-contact";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { useDebounce } from "@uidotdev/usehooks";
import noDataImg from "@/config/path";
import { useStore } from "@/stores/store";

export const SearchContact: React.FC = () => {
    const { refetch } = useStore();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedFullName = useDebounce(fullName, 300);
    const debouncedEmail = useDebounce(email, 300);
    const debouncedPhone = useDebounce(phone, 300);

    const { isLoading, data, fetchNextPage, isFetchingNextPage, hasNextPage, error } = useInfiniteQuery({
        queryKey: ["products", refetch, debouncedFullName, debouncedEmail, debouncedPhone],
        queryFn: ({ pageParam = 1 }) =>
            searchContactMutation({
                name: debouncedFullName,
                email: debouncedEmail,
                phone: debouncedPhone,
                page: pageParam,
                size: 10,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= (lastPage.paging?.total_page ?? 1) ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const currentPageData = data?.pages[currentPage - 1]?.data ?? [];
    const totalPages = data?.pages[0]?.paging?.total_page || 1;

    const table = useReactTable({
        data: currentPageData,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        manualPagination: true,
        pageCount: totalPages,
    });

    const handleNextPage = async () => {
        const nextPageNumber = currentPage + 1;

        if (nextPageNumber > data!.pages.length && hasNextPage) {
            await fetchNextPage();
        }

        setCurrentPage(nextPageNumber);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const LoadingSkeleton = () => (
        <>
            {Array(10)
                .fill(0)
                .map((_, idx) => (
                    <TableRow key={idx}>
                        <TableCell colSpan={columns.length}>
                            <div className="w-full animate-pulse">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
        </>
    );

    return (
        <div className="w-full p-8">
            {error && (
                <div className="w-full flex justify-center items-center my-8 h-[70%]">
                    <div className="p-4 flex flex-col justify-center items-center gap-8">
                        <img src={noDataImg} alt="No Data" className="max-h-[40vh]" />
                        <h2 className="font-bold text-primarypink text-lg md:text-2xl">Network Error!</h2>
                    </div>
                </div>
            )}

            {!error && (
                <>
                    <div className="flex items-center space-x-4 py-4">
                        <Input placeholder="Name..." value={fullName} onChange={(event) => setFullName(event.target.value)} className="max-w-sm" />
                        <Input placeholder="Email..." value={email} onChange={(event) => setEmail(event.target.value)} className="max-w-sm" />
                        <Input placeholder="Phone..." value={phone} onChange={(event) => setPhone(event.target.value)} className="max-w-sm" />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <LoadingSkeleton />
                                ) : currentPageData.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="ps-6">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            <div className="w-full flex justify-center items-center my-8">
                                                <div className="p-4 flex flex-col justify-center items-center gap-8">
                                                    <img src={noDataImg} alt="No Data" className="max-h-[40vh]" />
                                                    <h2 className="font-bold text-primarypink text-lg md:text-2xl">Empty Contacts!</h2>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="space-x-2">
                                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={isFetchingNextPage || currentPage >= totalPages}>
                                    {isFetchingNextPage ? "Loading..." : "Next"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
