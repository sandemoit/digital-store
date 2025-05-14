<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rekening extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'kode',
        'logo',
        'no_rek',
        'atas_nama',
        'bank',
        'jenis',
        'metode',
        'is_active',
    ];
}
