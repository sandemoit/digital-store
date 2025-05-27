<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'file_url'
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

    /**
     * Get the comments for the product.
     */
    public function komentar(): HasMany
    {
        return $this->hasMany(Komentar::class);
    }

    /**
     * Get the reviews for the product.
     */
    public function ulasan(): HasMany
    {
        return $this->hasMany(Ulasan::class);
    }

    /**
     * Get the transaksi for the product.
     */
    public function transaksiItem()
    {
        return $this->hasMany(transaksiItem::class);
    }

    /**
     * Get the transaksi for the product.
     */
    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }
}
