<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    protected $table = 'footer'; // pakai nama tabel 'footer' (bukan 'footers')
    protected $fillable = [
        'contact_title', 'contact_item1', 'contact_item2', 'contact_item3', 'contact_item4',
        'other_title', 'other_item1', 'other_item2', 'other_item3', 'other_item4',
        'connect_title', 'connect_item1', 'connect_item2', 'connect_item3', 'connect_item4'
    ];
}
