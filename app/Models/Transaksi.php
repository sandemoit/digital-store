<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Transaksi extends Model
{
    use HasFactory;
    protected $table = 'transaksi';
    protected $appends = ['payment_proof_url'];
    protected $fillable = [
        'user_id',
        'payment_method_id',
        'order_number',
        'subtotal',
        'payment_fee',
        'wallet_amount',
        'total_amount',
        'status',
        'payment_status',
        'payment_proof',
        'payment_date',
        'confirmed_at',
        'confirmed_by',
        'cancelled_at',
        'notes',
        'midtrans_token',
        'midtrans_transaction_id',
        'midtrans_response',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'payment_fee' => 'decimal:2',
        'wallet_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'midtrans_response' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(TransaksiItem::class);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    // Accessors
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => ['text' => 'Menunggu Pembayaran', 'color' => 'yellow'],
            'processing' => ['text' => 'Diproses', 'color' => 'blue'],
            'completed' => ['text' => 'Selesai', 'color' => 'green'],
            'cancelled' => ['text' => 'Dibatalkan', 'color' => 'red'],
        ];

        return $badges[$this->status] ?? ['text' => 'Unknown', 'color' => 'gray'];
    }

    public function getPaymentStatusBadgeAttribute()
    {
        $badges = [
            'pending' => ['text' => 'Belum Bayar', 'color' => 'yellow'],
            'paid' => ['text' => 'Sudah Bayar', 'color' => 'green'],
            'failed' => ['text' => 'Gagal', 'color' => 'red'],
            'cancelled' => ['text' => 'Dibatalkan', 'color' => 'red'],
        ];

        return $badges[$this->payment_status] ?? ['text' => 'Unknown', 'color' => 'gray'];
    }

    // Methods
    public function canBeCancelled()
    {
        return $this->status === 'pending' && $this->payment_status !== 'paid';
    }

    public function isManualPayment()
    {
        return $this->paymentMethod && $this->paymentMethod->method === 'manual';
    }

    public function isAutomaticPayment()
    {
        return $this->paymentMethod && $this->paymentMethod->method === 'automatic';
    }

    public function getPaymentProofUrlAttribute()
    {
        if ($this->payment_proof) {
            return Storage::url($this->payment_proof);
        }
        return null;
    }

    /**
     * Check if payment proof exists
     */
    public function hasPaymentProof()
    {
        return $this->payment_proof && Storage::disk('public')->exists($this->payment_proof);
    }
}
