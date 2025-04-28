// resources/js/Components/ProdukForm.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

interface ProdukFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    produk: any;
    onSuccess: () => void;
}

export default function ProdukForm({ open, setOpen, produk, onSuccess }: ProdukFormProps) {
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        harga: '',
        stok: '',
        gambar: [] as File[],
    });

    useEffect(() => {
        if (produk) {
            setData({
                name: produk.name,
                harga: produk.harga,
                stok: produk.stok,
                gambar: [],
            });
        } else {
            reset();
        }
    }, [produk]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (produk) {
            put(`/produk/${produk.id}`, {
                onSuccess: () => {
                    onSuccess();
                    setOpen(false);
                }
            });
        } else {
            post('/produk', {
                onSuccess: () => {
                    onSuccess();
                    setOpen(false);
                }
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{produk ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Nama Produk"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <Input
                        placeholder="Harga"
                        type="number"
                        value={data.harga}
                        onChange={(e) => setData('harga', e.target.value)}
                    />
                    <Input
                        placeholder="Stok"
                        type="number"
                        value={data.stok}
                        onChange={(e) => setData('stok', e.target.value)}
                    />
                    <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                            if (e.target.files) {
                                setData('gambar', Array.from(e.target.files)); // konversi FileList -> File[]
                            }
                        }}
                    />
                    <Button type="submit" disabled={processing} className="w-full">
                        {produk ? 'Update' : 'Simpan'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
