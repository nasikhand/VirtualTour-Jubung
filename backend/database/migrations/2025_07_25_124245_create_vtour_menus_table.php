<?php

// database/migrations/xxxx_xx_xx_create_vtour_menus_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vtour_menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedBigInteger('scene_id'); // relasi ke vtour_scenes
            $table->string('preview_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('scene_id')->references('id')->on('vtour_scenes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vtour_menus');
    }
};
