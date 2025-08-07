<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VtourHotspot extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'scene_id',
        'type',
        'yaw',
        'pitch',
        'label',
        'description',
        'target_scene_id',
        'sentences', // ✅ 1. Tambahkan 'sentences' di sini
        'icon_name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sentences' => 'array', // ✅ 2. Tambahkan ini agar Laravel otomatis mengubah array -> JSON
    ];

    public function scene()
    {
        return $this->belongsTo(VtourScene::class, 'scene_id');
    }

    public function targetScene()
    {
        return $this->belongsTo(VtourScene::class, 'target_scene_id');
    }
}
