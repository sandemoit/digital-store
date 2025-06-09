<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mengarahkan ke Pembayaran...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .spinner {
            width: 50px;
            height: 50px;
            margin: 0 auto 1rem;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            margin-top: 1rem;
        }

        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="spinner"></div>
        <h2>Mengarahkan ke Halaman Pembayaran</h2>
        <p>Mohon tunggu sebentar, Anda akan diarahkan ke gateway pembayaran...</p>
        <p><small>Order: {{ $transaction->order_number }}</small></p>

        <div style="margin-top: 2rem;">
            <a href="{{ $checkout_url }}" class="btn" id="manual-redirect">
                Lanjutkan Pembayaran Manual
            </a>
        </div>
    </div>

    <script>
        // Auto redirect setelah 2 detik
        setTimeout(function() {
            window.location.href = '{{ $checkout_url }}';
        }, 2000);

        // Fallback manual redirect
        document.getElementById('manual-redirect').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '{{ $checkout_url }}';
        });
    </script>
</body>

</html>
