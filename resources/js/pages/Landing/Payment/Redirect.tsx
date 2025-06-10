import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  order_number: string;
  total_amount: number;
  payment_method: string;
}

interface PaymentRedirectProps {
  transaction: Transaction;
  checkout_url?: string | null;
  skip_api_call?: boolean;
  flash?: {
    success?: string;
    error?: string;
  };
}

interface PaymentGatewayResponse {
  success: boolean;
  checkout_url?: string;
  message?: string;
  error_code?: string;
  data?: {
    order_number: string;
  };
}

const PaymentRedirect: React.FC<PaymentRedirectProps> = ({
  transaction,
  checkout_url: initialCheckoutUrl,
  skip_api_call = false,
  flash
}) => {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(initialCheckoutUrl || null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Mempersiapkan pembayaran...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showRetry, setShowRetry] = useState<boolean>(false);
  const [showManualRedirect, setShowManualRedirect] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const maxRetries = 3;
  const redirectDelay = 3000; // 3 seconds

  const getCsrfToken = (): string => {
    const token = document.head.querySelector<HTMLMetaElement>('[name="csrf-token"]');
    return token ? token.content : '';
  };

  const updateProgress = (percentage: number): void => {
    setProgress(Math.min(percentage, 100));
  };

  const updateStatus = (message: string): void => {
    setStatusMessage(message);
  };

  const showError = (message: string): void => {
    setError(message);
    setIsLoading(false);
    setShowRetry(true);
    setSuccess(false);
    toast.error(message);
  };

  const showSuccess = (url: string): void => {
    setSuccess(true);
    setError(null);
    setIsLoading(false);
    setCheckoutUrl(url);
    updateProgress(100);
    toast.success('Pembayaran berhasil dibuat!');
  };

  const processPaymentGateway = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setShowRetry(false);

      updateStatus('Menghubungi server pembayaran...');
      updateProgress(10);

      const response = await fetch(`/payment/process-gateway/${transaction.order_number}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
          'Accept': 'application/json',
        }
      });

      updateProgress(40);
      updateStatus('Memproses respons server...');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: PaymentGatewayResponse = await response.json();
      updateProgress(70);

      console.log('Payment Gateway Response:', data);

      if (data.success && data.checkout_url) {
        updateStatus('Transaksi berhasil dibuat!');
        updateProgress(90);

        showSuccess(data.checkout_url);

        // Show manual redirect button immediately
        setShowManualRedirect(true);

        // Auto redirect after delay
        setTimeout(() => {
          if (!isRedirecting) {
            redirectToPayment(data.checkout_url);
          }
        }, redirectDelay);

      } else {
        const errorMessage = data.message || 'Gagal membuat transaksi pembayaran';
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Payment Gateway Error:', error);

      let errorMessage = 'Terjadi kesalahan dalam memproses pembayaran';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    }
  };

  const redirectToPayment = (url: string = checkoutUrl || ''): void => {
    if (!url) {
      showError('URL pembayaran tidak tersedia');
      return;
    }

    setIsRedirecting(true);
    updateStatus('Mengarahkan ke halaman pembayaran...');
    updateProgress(100);

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      showError('URL pembayaran tidak valid');
      return;
    }

    // Open in new tab first as fallback
    const newWindow = window.open(url, '_blank');

    // Then redirect current window
    setTimeout(() => {
      window.location.href = url;
    }, 1000);

    // If popup blocked, show manual redirect
    // if (!newWindow) {
    //   setShowManualRedirect(true);
    //   updateStatus('Pop-up diblokir. Gunakan tombol manual di bawah.');
    // }
  };

  const retryPayment = async (): Promise<void> => {
    if (retryCount >= maxRetries) {
      showError(`Sudah mencoba ${maxRetries} kali. Silakan hubungi customer service.`);
      return;
    }

    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);

    updateStatus(`Mencoba lagi... (${newRetryCount}/${maxRetries})`);
    updateProgress(0);

    // Reset states
    setError(null);
    setShowRetry(false);
    setSuccess(false);
    setShowManualRedirect(false);
    setIsRedirecting(false);

    // Add small delay before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    await processPaymentGateway();
  };

  const handleBackToCheckout = (): void => {
    window.location.href = '/checkout';
  };

  // Handle visibility change (when user comes back from payment page)
  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (!document.hidden && checkoutUrl && success) {
        setShowManualRedirect(true);
        updateStatus('Kembali dari halaman pembayaran. Gunakan tombol di bawah jika diperlukan.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkoutUrl, success]);

  // Initial effect
  useEffect(() => {
    if (skip_api_call && checkoutUrl) {
      // If we already have checkout URL, show success and redirect
      showSuccess(checkoutUrl);
      setShowManualRedirect(true);

      setTimeout(() => {
        if (!isRedirecting) {
          redirectToPayment(checkoutUrl);
        }
      }, redirectDelay);
    } else {
      // Process payment gateway
      processPaymentGateway();
    }
  }, []);

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isLoading ? (
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            ) : success ? (
              <CheckCircle className="h-12 w-12 text-green-400" />
            ) : error ? (
              <XCircle className="h-12 w-12 text-red-400" />
            ) : null}
          </div>

          <CardTitle className="text-xl font-semibold text-white">
            {success ? 'Pembayaran Siap!' : 'Memproses Pembayaran'}
          </CardTitle>

          <div className="text-white/80 text-sm mt-2 space-y-1">
            <p>Order: <span className="font-mono text-white">{transaction.order_number}</span></p>
            <p>Total: <span className="font-semibold text-white">{formatCurrency(transaction.total_amount)}</span></p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress
              value={progress}
              className="h-2 bg-white/20"
            />
            <p className="text-sm text-white/70 text-center">
              {statusMessage}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 text-white">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="bg-green-500/20 border-green-500/50 text-white">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Pembayaran berhasil dibuat!
                {!isRedirecting && ' Klik tombol di bawah untuk melanjutkan.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Manual Redirect Section */}
          {showManualRedirect && checkoutUrl && (
            <div className="pt-4">
              <Button
                onClick={() => redirectToPayment(checkoutUrl)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isRedirecting}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isRedirecting ? 'Mengarahkan...' : 'Lanjutkan Pembayaran'}
              </Button>
            </div>
          )}

          {/* Retry Section */}
          {showRetry && (
            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={retryPayment}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={retryCount >= maxRetries}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryCount >= maxRetries ? 'Batas Percobaan Tercapai' : `Coba Lagi (${retryCount}/${maxRetries})`}
              </Button>

              <Button
                onClick={handleBackToCheckout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Checkout
              </Button>
            </div>
          )}

          {/* Loading indicator for auto-redirect */}
          {success && !isRedirecting && (
            <div className="text-center text-sm text-white/60 pt-2">
              Otomatis mengarahkan dalam {Math.ceil(redirectDelay / 1000)} detik...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRedirect;
