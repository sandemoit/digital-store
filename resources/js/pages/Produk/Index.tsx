import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types/produk';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import ProdukForm from '@/components/produkAdmin/ProdukForm';
import { DataTable } from '@/components/DataTable'; // Kita buat komponen Table Reusable
import axios from 'axios';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface Produk {
    id: number;
    name: string;
    harga: number;
    stok: number;
    gambar: string[];
}

interface ProdukPageProps extends PageProps {
    title: string;
    kategori: any[];
}

export default function ProdukIndex({ title, kategori }: ProdukPageProps) {
    const [open, setOpen] = useState(false);
    const [produkEdit, setProdukEdit] = useState<Produk | null>(null);
    const [search, setSearch] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '/dashboard',
        },
    ];

    const columns = [
        {
            header: "Nama Produk",
            accessorKey: "name",
        },
        {
            header: "Harga",
            accessorKey: "harga",
            cell: ({ row }: any) => `Rp ${row.original.harga.toLocaleString('id-ID')}`,
        },
        {
            header: "Stok",
            accessorKey: "stok",
        },
        {
            header: "Kategori",
            accessorKey: "kategori.nama",
        },
        {
            header: "Aksi",
            cell: ({ row }: any) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(row.original)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>Hapus</Button>
                </div>
            ),
        }
    ];

    const [data, setData] = useState<Produk[]>([]);

    useEffect(() => {
        fetchProduk();
    }, []);

    const fetchProduk = async () => {
        const res = await axios.get('/admin/produk/data');
        setData(res.data.data);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Yakin mau hapus produk ini?')) {
            await router.delete(`/admin/product/${id}`);
            fetchProduk();
        }
    };

    const handleEdit = (produk: Produk) => {
        router.get(`/admin/product/${produk.id}/edit`);
    };

    const handleCreate = () => {
        router.get('/admin/product/create');
    };

    const handleSearch = async () => {
        const res = await axios.get('/admin/produk/data', {
            params: {
                search: search,
            },
        });
        setData(res.data.data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Daftar Produk</h1>
                    <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" /> Tambah Produk</Button>
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="w-4 h-4 mr-2" /> Cari
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <DataTable columns={columns} data={data} />
                    </CardContent>
                </Card>

                <ProdukForm open={open} setOpen={setOpen} produk={produkEdit} onSuccess={fetchProduk} />
            </div>
        </AppLayout>
    );
}
