import React, { useEffect, useRef, useState, useCallback } from 'react';

interface TurnstileLoginProps {
    siteKey: string;
    enabled: boolean;
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpired?: () => void;
    className?: string;
}

declare global {
    interface Window {
        turnstile: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

const TurnstileLogin: React.FC<TurnstileLoginProps> = ({
    siteKey,
    enabled,
    onSuccess,
    onError,
    onExpired,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Don't render if disabled
    if (!enabled) {
        return null;
    }

    // Load Turnstile script - runs only once
    useEffect(() => {
        if (window.turnstile) {
            setIsScriptLoaded(true);
            return;
        }

        setIsLoading(true);
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;

        const handleLoad = () => {
            setIsScriptLoaded(true);
            setIsLoading(false);
        };

        const handleError = () => {
            setIsLoading(false);
            console.error('Failed to load Turnstile script');
            onError?.();
        };

        script.addEventListener('load', handleLoad);
        script.addEventListener('error', handleError);
        document.head.appendChild(script);

        return () => {
            script.removeEventListener('load', handleLoad);
            script.removeEventListener('error', handleError);
        };
    }, []); // Empty dependency array

    // Render widget when script is loaded or siteKey changes
    useEffect(() => {
        if (!isScriptLoaded || !containerRef.current || !window.turnstile) {
            return;
        }

        // Remove existing widget if any
        if (widgetIdRef.current) {
            try {
                window.turnstile.remove(widgetIdRef.current);
            } catch (error) {
                console.warn('Failed to remove previous Turnstile widget:', error);
            }
        }

        // Render new widget
        try {
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: onSuccess,
                'error-callback': onError,
                'expired-callback': onExpired,
                theme: 'light',
            });
        } catch (error) {
            console.error('Failed to render Turnstile widget:', error);
            onError?.();
        }

        return () => {
            if (widgetIdRef.current) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (error) {
                    console.warn('Failed to cleanup Turnstile widget:', error);
                }
            }
        };
    }, [isScriptLoaded, siteKey]); // Removed callback dependencies

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center p-2 ${className}`}>
                <div className="text-sm text-gray-500">Loading security verification...</div>
            </div>
        );
    }

    return <div ref={containerRef} className={className} />;
};

export default React.memo(TurnstileLogin);