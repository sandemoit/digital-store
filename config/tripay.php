<?php

return [
    'private_key' => env('TRIPAY_PRIVATE_KEY'),
    'api_key' => env('TRIPAY_API_KEY'),
    'merchant_code' => env('TRIPAY_MERCHANT_CODE'),
    'base_url' => env('TRIPAY_DEV', false) ? env('TRIPAY_SANDBOX_URL') : env('TRIPAY_PROD_URL'),
];
