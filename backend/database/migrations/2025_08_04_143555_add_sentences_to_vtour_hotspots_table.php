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
        Schema::table('vtour_hotspots', function (Blueprint $table) {
            // Tambahkan kolom 'sentences' setelah 'description'
            $table->json('sentences')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vtour_hotspots', function (Blueprint $table) {
            //
        });
    }
};
