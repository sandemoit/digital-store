import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { toast } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el)

        const AppWithToast = () => {
            const { toast: toastData } = props as any

            useEffect(() => {
                if (toastData?.message) {
                    const type = toastData.type || 'default'
                    if (type === 'success') toast.success(toastData.message)
                    else if (type === 'error') toast.error(toastData.message)
                    else if (type === 'info') toast.info(toastData.message)
                    else toast(toastData.message)
                }
            }, [])

            return (
                <>
                    <App {...props} />
                    <Toaster richColors position="top-right" />
                </>
            )
        }

        root.render(<AppWithToast />)
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
