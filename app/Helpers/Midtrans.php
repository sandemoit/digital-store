<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class Midtrans
{
    public static function createSignature($data)
    {
        return hash('sha512', $data);
    }
}
