<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['income', 'expense'])->default('expense');
            $table->integer('amount');
            $table->string('title');
            $table->text('note')->nullable();
            $table->date('transaction_date');
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
