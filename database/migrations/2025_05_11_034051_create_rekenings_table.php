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
        Schema::create('rekenings', function (Blueprint $table) {
            $table->id();
            $table->string('kode');
            $table->string('logo')->nullable();
            $table->string('no_rek')->nullable();
            $table->string('atas_nama')->nullable();
            $table->string('bank')->nullable();
            $table->enum('jenis', ['bank', 'ewallet']);
            $table->string('metode')->default('manual');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekenings');
    }
};
