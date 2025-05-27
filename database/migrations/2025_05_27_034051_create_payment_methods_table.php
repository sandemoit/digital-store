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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g., 'bri', 'gopay', 'qris', etc.
            $table->string('name'); // e.g., 'BRI', 'GoPay', 'QRIS', etc.
            $table->string('logo')->nullable();
            $table->enum('type', ['bank_transfer', 'virtual_account', 'e_wallet', 'qris', 'retail_outlet']);
            $table->enum('method', ['manual', 'automatic']);
            $table->decimal('fee', 10, 2)->default(0); // Fee for automatic payments
            $table->text('instructions')->nullable(); // For manual transfers
            $table->string('account_number')->nullable(); // For bank transfers
            $table->string('account_name')->nullable(); // For bank transfers
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
