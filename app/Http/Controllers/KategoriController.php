<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index()
    {
        $kategoris = Kategori::latest()->get();

        return Inertia::render('Kategori/Index', [
            'title' => 'Kategori List',
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        Kategori::create($request->all());

        return redirect()->back();
    }

    public function update(Request $request, Kategori $kategori)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kategori->update($request->all());

        return redirect()->back();
    }

    public function destroy(Kategori $kategori)
    {
        $kategori->delete();

        return redirect()->back();
    }
}
