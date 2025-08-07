<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VtourScene extends Model
{
    protected $fillable = ['name', 'image_path', 'default_yaw', 'default_pitch'];

    public function hotspots()
    {
        return $this->hasMany(VtourHotspot::class, 'scene_id');
    }
}
    

