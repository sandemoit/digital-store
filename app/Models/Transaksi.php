<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'rekening_id',
        'nominal',
        'status_transaksi',
    ];

    public function produk()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function rekening()
    {
        return $this->belongsTo(Rekening::class, 'rekening_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_Id');
    }
}
