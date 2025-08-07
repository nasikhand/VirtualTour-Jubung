<?php
// app/Models/VtourMenu.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\VtourScene;

class VtourMenu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'scene_id',
        'preview_image',
        'is_active',
        'is_default',
        'order',
    ];

    public function scene()
    {
        return $this->belongsTo(VtourScene::class, 'scene_id');
    }
}
