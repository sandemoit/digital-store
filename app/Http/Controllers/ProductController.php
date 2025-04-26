<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $title = 'Produk List';
        return Inertia::render('produk', [
            'title' => $title,
        ]);
    }
}
