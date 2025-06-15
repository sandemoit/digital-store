import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { router } from "@inertiajs/react";

export interface Props {
    url: any;
    title: string;
    className: string;
}

export const AlertBatal = ({ url, title, className = '' }: Props) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className={className}>
                    {title}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Yakin ingin membatalkan pesanan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Pesanan akan dianggap batal dan tidak bisa diproses ulang.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => router.get(url)}>
                        Ya, Batalkan
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}