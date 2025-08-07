<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('vtour_hotspots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scene_id')->constrained('vtour_scenes')->onDelete('cascade');
            $table->enum('type', ['info', 'link']);
            $table->float('yaw');
            $table->float('pitch');
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('target_scene_id')->nullable()->constrained('vtour_scenes')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vtour_hotspots');
    }
};
