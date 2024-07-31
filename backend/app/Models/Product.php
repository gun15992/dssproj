<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'oldsn',
        'newsn',
        'name',
        'brand',
        'model',
        'modelsn',
        'yearsl',
        'dateexp',
        'price',
        'organization',
        'location',
        'detail',
        'description',
        'status',
        'image',
        'category_code'
    ];

    protected $attributes = [
        'oldsn' => '',
        'detail' => '',
        'description' => ''
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_code', 'category_code');
    }
}
