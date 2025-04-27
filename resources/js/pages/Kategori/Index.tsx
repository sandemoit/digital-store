import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types/kategori';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface Kategori {
    id: number;
    nama: string;
}

interface KategoriPageProps extends PageProps {
    kategoris: Kategori[];
    title: string;
}

export default function KategoriIndex({ kategoris, title }: KategoriPageProps) {
    const { data, setData, post, delete: destroy, reset } = useForm({
        nama: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: '/kategori',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kategori.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Kategori</h1>

                <form onSubmit={handleSubmit} className="mb-6">
                    <input
                        type="text"
                        value={data.nama}
                        onChange={(e) => setData('nama', e.target.value)}
                        className="border p-2 mr-2"
                        placeholder="Nama kategori"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Tambah
                    </button>
                </form>

                <div className="space-y-2">
                    {kategoris.map((kategori) => (
                        <div key={kategori.id} className="flex justify-between items-center p-4 border rounded">
                            <span>{kategori.nama}</span>
                            <button
                                onClick={() => destroy(route('kategori.destroy', kategori.id))}
                                className="text-red-500"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
