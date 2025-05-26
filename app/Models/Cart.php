<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'products_id',
        'jumlah'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'products_id'); // custom foreign key
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
