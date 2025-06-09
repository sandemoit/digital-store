import React, { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle } from 'react';

interface TurnstileProps {
    siteKey: string;
    onVerified: (token: string) => void;
    onError: () => void;
    onExpired?: () => void;
    theme?: 'light' | 'dark' | 'auto';
    size?: 'normal' | 'compact';
    className?: string;
}

interface TurnstileInstance {
    render: (container: string | HTMLElement, options: TurnstileOptions) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId?: string) => void;
    getResponse: (widgetId?: string) => string;
}

interface TurnstileOptions {
    sitekey: string;
    callback?: (token: string) => void;
    'error-callback'?: () => void;
    'expired-callback'?: () => void;
    theme?: string;
    size?: string;
    'refresh-expired'?: 'auto' | 'manual' | 'never';
    'retry'?: 'auto' | 'never';
}

declare global {
    interface Window {
        turnstile?: TurnstileInstance;
        onloadTurnstileCallback?: () => void;
    }
}

export interface TurnstileRef {
    reset: () => void;
}

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(({
    siteKey,
    onVerified,
    onError,
    onExpired,
    theme = 'light',
    size = 'normal',
    className = ''
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitializingRef = useRef(false);

    const handleVerified = useCallback((token: string) => {
        // console.log('Turnstile verified successfully');
        onVerified(token);
    }, [onVerified]);

    const handleError = useCallback(() => {
        // console.error('Turnstile error occurred');
        onError();
    }, [onError]);

    const handleExpired = useCallback(() => {
        // console.log('Turnstile token expired');
        onExpired?.();
    }, [onExpired]);

    const cleanupWidget = useCallback(() => {
        if (window.turnstile && widgetIdRef.current) {
            try {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            } catch (error) {
                // console.error('Error removing Turnstile widget:', error);
            }
        }
        isInitializingRef.current = false;
    }, []);

    const initTurnstile = useCallback(() => {
        if (!window.turnstile || !containerRef.current || !siteKey || isInitializingRef.current) {
            return;
        }

        try {
            isInitializingRef.current = true;

            // Clean up existing widget
            cleanupWidget();

            // Clear container
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }

            // console.log('Initializing Turnstile widget');

            // Render new widget
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: handleVerified,
                'error-callback': handleError,
                'expired-callback': handleExpired,
                theme,
                size,
                'refresh-expired': 'manual',
                'retry': 'auto'
            });

            // console.log('Turnstile widget initialized');
        } catch (error) {
            // console.error('Error initializing Turnstile:', error);
            isInitializingRef.current = false;
            handleError();
        }
    }, [siteKey, handleVerified, handleError, handleExpired, theme, size, cleanupWidget]);

    const resetWidget = useCallback(() => {
        if (window.turnstile && widgetIdRef.current) {
            try {
                // console.log('Resetting Turnstile widget');
                window.turnstile.reset(widgetIdRef.current);
            } catch (error) {
                // console.error('Error resetting Turnstile:', error);
                // If reset fails, reinitialize
                setTimeout(() => {
                    initTurnstile();
                }, 100);
            }
        } else {
            // If no widget exists, initialize new one
            setTimeout(() => {
                initTurnstile();
            }, 100);
        }
    }, [initTurnstile]);

    // Expose reset method via ref
    useImperativeHandle(ref, () => ({
        reset: resetWidget
    }), [resetWidget]);

    // Load Turnstile script
    useEffect(() => {
        const loadScript = () => {
            // Check if already loaded
            if (window.turnstile) {
                setIsLoaded(true);
                return;
            }

            // Check if script is already loading
            if (isScriptLoading) {
                return;
            }

            // Check if script already exists
            const existingScript = document.querySelector('script[src*="turnstile"]');
            if (existingScript) {
                setIsScriptLoading(true);

                const checkLoaded = () => {
                    if (window.turnstile) {
                        setIsLoaded(true);
                        setIsScriptLoading(false);
                    } else {
                        setTimeout(checkLoaded, 100);
                    }
                };
                checkLoaded();
                return;
            }

            setIsScriptLoading(true);

            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
            script.async = true;
            script.defer = true;

            // Global callback for when Turnstile is ready
            window.onloadTurnstileCallback = () => {
                // console.log('Turnstile script loaded successfully');
                setIsLoaded(true);
                setIsScriptLoading(false);
            };

            script.onerror = () => {
                // console.error('Failed to load Turnstile script');
                setIsScriptLoading(false);
                handleError();
            };

            document.head.appendChild(script);
        };

        loadScript();

        return () => {
            if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
            }
        };
    }, [handleError, isScriptLoading]);

    // Initialize widget when script is loaded
    useEffect(() => {
        if (isLoaded && siteKey) {
            // Small delay to ensure DOM is ready
            if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
            }

            initTimeoutRef.current = setTimeout(() => {
                initTurnstile();
            }, 250);
        }

        return () => {
            if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
            }
        };
    }, [isLoaded, siteKey, initTurnstile]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanupWidget();
            if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
            }
        };
    }, [cleanupWidget]);

    return (
        <div className={`turnstile-container ${className}`}>
            <div
                ref={containerRef}
                className="turnstile-widget"
                style={{ justifyContent: 'center', alignItems: 'center' }}
            />
            {(!isLoaded || isScriptLoading) && (
                <div className="flex items-center justify-center py-4">
                    <div className="text-sm text-gray-500">Loading verification...</div>
                </div>
            )}
        </div>
    );
});

Turnstile.displayName = 'Turnstile';

export default Turnstile;