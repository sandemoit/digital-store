// resources/js/Components/DataTable.tsx

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-2">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-white">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-600">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={table.getAllLeafColumns().length} className="text-center font-semibold text-gray-600">
                                Data tidak ditemukan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
