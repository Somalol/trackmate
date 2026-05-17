<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TodoItem extends Model
{
    use HasFactory;

    protected $fillable = ['todo_list_id', 'assigned_user_id', 'task', 'is_completed'];

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function todoList()
    {
        return $this->belongsTo(TodoList::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}