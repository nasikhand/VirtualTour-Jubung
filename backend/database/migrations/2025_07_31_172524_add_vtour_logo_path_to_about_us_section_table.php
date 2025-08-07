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
        Schema::table('about_us_section', function (Blueprint $table) {
            $table->string('vtour_logo_path')->nullable()->after('hero_desc_contact_us');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('about_us_section', function (Blueprint $table) {
            //
        });
    }
};
