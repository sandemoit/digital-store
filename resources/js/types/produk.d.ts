export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            // tambahkan field user kalau perlu
        };
    };
    errors: Record<string, string>;
}
