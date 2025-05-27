<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'logo',
        'type',
        'method',
        'fee',
        'instructions',
        'account_number',
        'account_name',
        'is_active'
    ];

    protected $casts = [
        'fee' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    // Relationship with Transaksi
    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }
}
