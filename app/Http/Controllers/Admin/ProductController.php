<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        return redirect()->route('product.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $produk = Product::with('kategori')->findOrFail($id);
        $title = 'Edit Produk';
        $kategori = Kategori::select('id', 'nama')->get();

        return Inertia::render('Produk/Edit', [
            'title' => $title,
            'kategori' => $kategori,
            'produk' => $produk,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Debug: Lihat data yang dikirim
        // dd($request->all());

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

            // Perbaikan untuk handling gambar
            'gambar' => 'nullable|array',
            'gambar.*' => 'nullable|file|image|mimes:jpeg,png,jpg|max:2048',
            'existing_gambar' => 'nullable|array',
            'existing_gambar.*' => 'nullable|integer',
            'gambar_to_remove' => 'nullable|array',
            'gambar_to_remove.*' => 'nullable|integer',
        ]);

        $produk = Product::findOrFail($id);

        // Ambil gambar yang sudah ada dari database
        $gambarExisting = $produk->gambar ?? [];

        // Jika kolom `gambar` berupa string JSON, decode dulu
        if (is_string($gambarExisting)) {
            $gambarExisting = json_decode($gambarExisting, true) ?? [];
        }

        // Debug: Lihat data yang diterima
        Log::info('Request data:', $request->all());

        // Ambil existing_gambar dari request
        $existingGambarIds = $request->input('existing_gambar', []);
        Log::info('Existing gambar IDs from request:', $existingGambarIds);

        // Proses gambar yang akan dihapus
        $gambarToRemove = $request->input('gambar_to_remove', []);
        Log::info('Gambar to remove:', $gambarToRemove);

        // Jika ada existing_gambar yang dikirim dari frontend, filter berdasarkan itu
        if (!empty($existingGambarIds)) {
            $gambarExisting = array_filter($gambarExisting, function ($gambar) use ($existingGambarIds) {
                return in_array($gambar['id'] ?? null, $existingGambarIds);
            });
            $gambarExisting = array_values($gambarExisting);
        }

        // Kemudian hapus yang ada di gambar_to_remove
        if (!empty($gambarToRemove)) {
            $gambarExisting = array_filter($gambarExisting, function ($gambar) use ($gambarToRemove) {
                return !in_array($gambar['id'] ?? null, $gambarToRemove);
            });
            $gambarExisting = array_values($gambarExisting);
        }

        Log::info('Final existing gambar:', $gambarExisting);

        // Proses gambar baru yang diupload
        $gambarBaru = [];
        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $index => $file) {
                $filename = 'product-' . time() . '-' . ($index + 1) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('produk', $filename, 'public');

                $gambarBaru[] = [
                    'id' => null, // ID akan di-generate oleh database jika diperlukan
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                ];
            }
        }

        // Gabungkan gambar existing (yang tidak dihapus) + gambar baru
        $allGambar = array_merge($gambarExisting, $gambarBaru);

        // Set data yang akan diupdate
        $dataToUpdate = [
            'name' => $validated['name'],
            'deskripsi' => $validated['deskripsi'],
            'harga' => $validated['harga'],
            'stok' => $validated['stok'],
            'id_kategori' => $validated['id_kategori'],
            'framework' => $validated['framework'],
            'php_version' => $validated['php_version'],
            'database' => $validated['database'],
            'author' => $validated['author'],
            'versi' => $validated['versi'],
            'link_demo' => $validated['link_demo'],
            'faq' => $validated['faq'],
            'is_active' => $request->has('is_active') ? 1 : 0,
            'gambar' => $allGambar,
        ];

        // Update produk
        $produk->update($dataToUpdate);

        return redirect()->route('product.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        try {
            $produk = Product::findOrFail($id);
            // Validasi apakah produk ditemukan
            if (!$produk) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk tidak ditemukan'
                ], 404);
            }

            // Mulai transaksi database
            DB::beginTransaction();

            // Hapus relasi terlebih dahulu jika ada
            if (method_exists($produk, 'images')) {
                $produk->images()->delete();
            }

            // Hapus file gambar dari storage
            $images = is_string($produk->gambar) ? json_decode($produk->gambar, true) : $produk->gambar;
            foreach ((array)$images as $image) {
                if (!empty($image['path']) && Storage::disk('public')->exists($image['path'])) {
                    Storage::disk('public')->delete($image['path']);
                }
            }

            // Hapus produk
            $deleted = $produk->delete();

            if (!$deleted) {
                throw new \Exception('Failed to delete product from database');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus',
                'deleted_id' => $produk->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Delete product failed:', [
                'id' => $produk->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus produk: ' . $e->getMessage()
            ], 500);
        }
    }
}
