<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'join_code', 'creator_id'];

    // A csoport létrehozója
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    // A csoport tagjai
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    // A csoporthoz tartozó saját kategóriák
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    // A csoport tranzakciói
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}