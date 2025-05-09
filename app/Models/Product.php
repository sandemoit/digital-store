<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'deskripsi',
        'harga',
        'stok',
        'gambar',
        'id_kategori',
        'framework',
        'php_version',
        'database',
        'author',
        'versi',
        'link_demo',
        'faq',
        'is_active',
    ];

    protected $casts = [
        'harga' => 'decimal:2',
        'is_active' => 'boolean',
        'gambar' => 'array',
    ];

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori');
    }
}
