<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\Facades\DataTables;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $title = 'Produk List';
        return Inertia::render('Produk/Index', [
            'title' => $title,
        ]);
    }

    public function show($id)
    {
        return inertia('landing/Produk/Show', [
            'id' => $id
        ]);
    }

    public function data(Request $request)
    {
        $query = Product::query();

        if ($search = $request->input('search.value')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return DataTables::of($query)
            ->addIndexColumn()
            ->make(true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'harga' => 'required|numeric',
            'stok' => 'required|numeric',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|max:2048',
        ]);

        $gambarPaths = [];
        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $gambar) {
                $gambarPaths[] = $gambar->store('produk', 'public');
            }
        }

        $data['gambar'] = json_encode($gambarPaths);

        Product::create($data);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, Product $produk)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'harga' => 'required|numeric',
            'stok' => 'required|numeric',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $gambarPaths = [];
            foreach ($request->file('gambar') as $gambar) {
                $gambarPaths[] = $gambar->store('produk', 'public');
            }
            $data['gambar'] = json_encode($gambarPaths);
        }

        $produk->update($data);

        return redirect()->back()->with('success', 'Produk berhasil diupdate.');
    }

    public function destroy(Product $produk)
    {
        $produk->delete();
        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }
}
