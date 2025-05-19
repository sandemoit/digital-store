<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function create()
    {
        $kategori = Kategori::select('id', 'nama')->get();

        return Inertia::render('Produk/Create', [
            'title' => 'Tambah Produk',
            'kategori' => $kategori,
        ]);
    }

    public function data(Request $request)
    {
        $query = Product::query()
            ->with('kategori');

        if ($search = $request->input('search.value')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return DataTables::of($query)
            ->addIndexColumn()
            ->make(true);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'gambar' => 'nullable|array',
            'gambar.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'id_kategori' => 'required|exists:kategoris,id',
            'framework' => 'nullable|string|max:100',
            'php_version' => 'nullable|string|max:50',
            'database' => 'nullable|string|max:100',
            'author' => 'nullable|string|max:100',
            'versi' => 'nullable|string|max:50',
            'link_demo' => 'nullable|url|max:255',
            'faq' => 'nullable|string',
            'is_active' => 'boolean',
            'file_url' => 'nullable|url',
        ]);

        // Process uploaded images
        $gambarPaths = [];
        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $index => $gambar) {
                // Generate unique filename with original extension
                $filename = 'product-' . time() . '-' . ($index + 1) . '.' . $gambar->getClientOriginalExtension();

                // Store the file in the 'produk' directory inside public storage
                $path = $gambar->storeAs('produk', $filename, 'public');

                // Add image metadata to array
                $gambarPaths[] = [
                    'path' => $path,
                    'name' => $gambar->getClientOriginalName(),
                ];
            }
        }

        // Store image paths as JSON
        $data['gambar'] = $gambarPaths;

        // Create the product
        Product::create($data);

        // Redirect with success message
        return redirect()->route('admin.product.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $produk)
    {
        $title = 'Edit Produk';
        $kategori = Kategori::select('id', 'nama')->get();

        return Inertia::render('Produk/Edit', [
            'title' => $title,
            'kategori' => $kategori,
            'produk' => $produk,
        ]);
    }


    public function update(Request $request, Product $produk)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'id_kategori' => 'required|exists:kategoris,id',
            'framework' => 'nullable|string',
            'php_version' => 'nullable|string',
            'database' => 'nullable|string',
            'author' => 'nullable|string',
            'versi' => 'nullable|string',
            'link_demo' => 'nullable|url',
            'faq' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'file_url' => 'nullable|url',
            'gambar.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $gambarLama = $produk->gambar ?? [];

        // Jika kolom `gambar` berupa string JSON, decode dulu
        if (is_string($gambarLama)) {
            $gambarLama = json_decode($gambarLama, true) ?? [];
        }

        $gambarBaru = [];

        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $index => $file) {
                $filename = 'product-' . time() . '-' . ($index + 1) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('produk', $filename, 'public');

                $gambarBaru[] = [
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                ];
            }
        }

        // Gabungkan gambar lama + baru
        $validated['gambar'] = array_merge($gambarLama, $gambarBaru);

        // Atur status aktif
        $validated['is_active'] = $request->has('is_active') ? 1 : 0;

        // Update produk
        $produk->update($validated);

        return redirect()->route('admin.produk')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $produk)
    {
        $produk->delete();
        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }
}
