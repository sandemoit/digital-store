<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('deskripsi')->nullable();
            $table->integer('harga')->default(0);
            $table->integer('stok')->default(0);
            $table->json('gambar')->nullable();
            $table->foreignId('id_kategori')->nullable()->constrained('kategoris')->onDelete('set null');
            $table->string('framework')->nullable();
            $table->string('php_version')->nullable();
            $table->string('database')->nullable();
            $table->string('author')->nullable();
            $table->string('versi')->nullable();
            $table->string('link_demo')->nullable();
            $table->longText('faq')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
