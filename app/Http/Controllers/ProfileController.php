<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return inertia('Landing/Profile/Index', [
            'title' => 'Profile'
        ]);
    }
}
