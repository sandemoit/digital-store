<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class Tripay
{
    public static function createSignature($data)
    {
        return hash_hmac('sha256', $data, config('tripay.private_key'));
    }
}
