'use client'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {useContext, useEffect} from 'react'
import useSWR from 'swr'
import {fetcher} from '@/services'
import {PaymentLog} from '@/types'
import CircularProgress from '@mui/material/CircularProgress'
import {LogsDashboardContext} from './Context'
import UsersPagination from './Pagination'

export default function UsersTable() {
    const {page, query, orderBy, setLastPage, lastPage, to, from} =
        useContext(LogsDashboardContext)
    const {data, error, isLoading} = useSWR<{ data: PaymentLog[]; meta: any }>(
        `/api/payments/logs?${new URLSearchParams({
            page: page.toString(),
            query,
            orderBy,
            to: to.toISOString(),
            from: from.toISOString(),
        }).toString()}`,
        fetcher
    )

    useEffect(() => {
        setLastPage(data?.meta['last_page'])
    }, [data])

    if (isLoading) {
        return (
            <div className="flex">
                <CircularProgress/>
            </div>
        )
    }

    if (data) {
        const logs = data.data
        return (
            <div className="space-y-2">
                <Table className="bg-background rounded">
                    <TableCaption
                        className="text-muted-foreground">{`Showing ${page} out of ${lastPage} page(s).`}</TableCaption>
                    <TableHeader>
                        <TableRow className="divide-gray-800 border-gray-800 text-muted-foreground">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Local ID</TableHead>
                            <TableHead>Payer e-mail</TableHead>
                            <TableHead className="text-right">Gateway</TableHead>
                            <TableHead className="text-right">Net</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-gray-200">
                        {logs.length > 0 &&
                            logs.map((log) => (
                                <TableRow
                                    key={log.id}
                                    className="divide-gray-800 border-gray-800"
                                >
                                    <TableCell className="font-medium">{log.id}</TableCell>
                                    <TableCell className="flex flex-row gap-2 items-center">
                                        {log.custom_id}
                                    </TableCell>
                                    <TableCell>{log.payer_email}</TableCell>
                                    <TableCell className="text-right">{log.payment_source}</TableCell>
                                    <TableCell className="text-right">{log.net}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <UsersPagination/>
            </div>
        )
    }
}
